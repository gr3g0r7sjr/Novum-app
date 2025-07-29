import pool from "../db.js"; // Asume que este es tu objeto Pool de PostgreSQL

export const postulacionesController = {
  aplicarVacantes: async (req, res) => {
    // Log para ver los datos exactos que llegan del frontend
    console.log("Datos recibidos en aplicarVacantes (req.body):", req.body);

    const {
      id_candidato,
      id_vacante,
      nombre,
      apellido,
      correo_electronico,
      numero_telefono,
      direccion,
      educacion, // Array de objetos (se espera JSONB en DB)
      experiencia_laboral,
      cursos_certificaciones,
      habilidades, // Array de objetos (se espera TEXT[] en DB)
      servicio_interes,
      vehiculo,
      tipo_identificacion, // Nuevo campo
      cedula, // Nuevo campo
      fecha_nacimiento, // Nuevo campo // Este campo se recibe del frontend pero no está en tu CREATE TABLE de candidatos
    } = req.body;

    let client; // Declara client fuera del try para que sea accesible en finally

    try {
      client = await pool.connect(); // Obtiene un cliente del pool
      await client.query("BEGIN"); // Inicia la transacción

      // 1. Validar id_vacante
      if (!id_vacante) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ message: "El ID de la vacante es requerido." });
      }
      const vacanteCheck = await client.query(
        "SELECT 1 FROM vacantes WHERE id_vacante = $1",
        [id_vacante]
      );
      if (vacanteCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Vacante no encontrada." });
      }

      let candidatoIdFinal = id_candidato;

      // 2. Si no se proporciona id_candidato, se asume que es un nuevo candidato
      // y se insertan sus datos.
      if (!id_candidato) {
        // Validación básica para el nuevo candidato
        if (
          !nombre ||
          !apellido ||
          !correo_electronico ||
          !tipo_identificacion ||
          !cedula ||
          !fecha_nacimiento
        ) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            message:
              "Para una nueva postulación, nombre, apellido, correo electrónico, tipo de identificación, cédula y fecha de nacimiento son requeridos.",
          });
        }

        // Opcional: Verificar si el correo o la cédula ya existe en candidatos para evitar duplicados
        const existingCandidate = await client.query(
          "SELECT id_candidato FROM public.candidatos WHERE correo_electronico = $1 OR (tipo_identificacion = $2 AND cedula = $3)",
          [correo_electronico, tipo_identificacion, cedula]
        );
        if (existingCandidate.rows.length > 0) {
          // Si el candidato ya existe, usamos su ID existente
          candidatoIdFinal = existingCandidate.rows[0].id_candidato;
          console.log(
            `Candidato con correo ${correo_electronico} o cédula ${tipo_identificacion}-${cedula} ya existe, usando ID: ${candidatoIdFinal}`
          );
          // NOTA: Si el candidato ya existe y quieres actualizar sus datos personales,
          // la lógica de actualización debería ir aquí. Por simplicidad, este ejemplo
          // solo usa el ID existente y no actualiza los datos del candidato.
        } else {
          // --- Preparación de datos para la inserción ---
          // educacion, experiencia_laboral, cursos_certificaciones son JSONB en DB, se pasan directamente.
          // habilidades es TEXT[] en DB, se necesita transformar de [{nombre: "skill"}] a ["skill"].
          const habilidadesArrayDeStrings = habilidades.map((h) => h.nombre);

          // Insertar nuevo candidato
          // La lista de columnas y el orden de los valores coinciden con tu CREATE TABLE
          // Ten en cuenta que 'fecha_expiracion_datos' no está en el CREATE TABLE que proporcionaste,
          // por lo que no se incluye en el INSERT a 'candidatos'.
          const newCandidatoResult = await client.query(
            `INSERT INTO public.candidatos (
                nombre, apellido, correo_electronico, numero_telefono, direccion,
                educacion, experiencia_laboral, cursos_certificaciones, habilidades,
                servicio_interes, vehiculo, tipo_identificacion, cedula, fecha_nacimiento
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id_candidato`,
            [
              nombre,
              apellido,
              correo_electronico,
              numero_telefono,
              direccion,
              educacion, // Pasa el array de objetos directamente (pg driver lo convierte a JSONB)
              experiencia_laboral, // Pasa el array de objetos directamente
              cursos_certificaciones, // Pasa el array de objetos directamente
              habilidadesArrayDeStrings, // Pasa el array de strings para TEXT[]
              servicio_interes,
              vehiculo,
              tipo_identificacion,
              cedula,
              fecha_nacimiento, // PostgreSQL DATE type can handle 'YYYY-MM-DD' string directly
            ]
          );
          candidatoIdFinal = newCandidatoResult.rows[0].id_candidato;
          console.log(`Nuevo candidato registrado con ID: ${candidatoIdFinal}`);
        }
      } else {
        // Si se proporciona id_candidato, verificar que exista
        const candidatoCheck = await client.query(
          "SELECT 1 FROM public.candidatos WHERE id_candidato = $1",
          [id_candidato]
        );
        if (candidatoCheck.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({
            message:
              "Candidato existente no encontrado con el ID proporcionado.",
          });
        }
      }

      // 3. Verificar si la postulación ya existe para evitar duplicados
      const existingPostulacion = await client.query(
        "SELECT 1 FROM postulaciones WHERE id_candidato = $1 AND id_vacante = $2",
        [candidatoIdFinal, id_vacante]
      );

      if (existingPostulacion.rows.length > 0) {
        await client.query("ROLLBACK");
        return res
          .status(409)
          .json({ message: "El candidato ya se ha postulado a esta vacante." });
      }

      // 4. Insertar la nueva postulación
      // Nota: fecha_postulacion_inicial se llenará automáticamente por DEFAULT CURRENT_TIMESTAMP
      const result = await client.query(
        "INSERT INTO postulaciones (id_candidato, id_vacante) VALUES ($1, $2) RETURNING *",
        [candidatoIdFinal, id_vacante]
      );

      await client.query("COMMIT"); // Confirma la transacción
      res.status(201).json({
        message: "✅ Postulación registrada exitosamente.",
        postulacion: result.rows[0],
      });
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK"); // Revierte la transacción en caso de error
      }
      console.error("🔥 Error al aplicar a la vacante:", error.message);
      // Incluir el error original en la respuesta para depuración (solo en desarrollo)
      res.status(500).json({
        message: "❌ Error interno del servidor al procesar la postulación.",
        detail: error.message, // Puedes quitar esto en producción
      });
    } finally {
      if (client) {
        client.release(); // Siempre libera el cliente de vuelta al pool
      }
    }
  },

  getPostulaciones: async (req, res) => {
    try {
      const result = await pool.query(`
          SELECT
              p.id_postulacion,
              p.fecha_postulacion,
              p.estado_postulacion,
              c.nombre AS candidato_nombre,
              c.apellido AS candidato_apellido,
              c.correo_electronico,
              c.tipo_identificacion,
              c.cedula,
              TO_CHAR(c.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento,
              c.numero_telefono,
              c.direccion,
              c.educacion,            -- JSONB (se recupera como objeto JS)
              c.experiencia_laboral,  -- JSONB
              c.cursos_certificaciones, -- JSONB
              c.habilidades,          -- TEXT[] (se recupera como array de strings)
              si.nombre_interes AS servicio_interes_nombre,
              c.vehiculo,
              -- Si fecha_expiracion_datos existe en la tabla candidatos, descomentar:
              -- TO_CHAR(c.fecha_expiracion_datos, 'YYYY-MM-DD') AS fecha_expiracion_datos,
              v.titulo_cargo AS vacante_titulo,
          FROM
              postulaciones p
          JOIN
              public.candidatos c ON p.id_candidato = c.id_candidato
          JOIN
              vacantes v ON p.id_vacante = v.id_vacante
          LEFT JOIN
              servicios_interes si ON c.servicio_interes = si.id_interes
          ORDER BY
              p.fecha_postulacion DESC;
        `);

      // No es necesario JSON.parse() para educacion, experiencia_laboral, cursos_certificaciones
      // si son JSONB, el driver 'pg' las devolverá como objetos JavaScript directamente.
      // Habilidades ya es un array de strings si se insertó correctamente en TEXT[].
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("🔥 Error al obtener postulaciones:", error.message);
      res.status(500).json({
        message: "❌ Error interno del servidor al obtener las postulaciones.",
        detail: error.message, // Puedes quitar esto en producción
      });
    }
  },

  getConteoPostulacionesPorVacante: async (req, res) => {
    try {
      const result = await pool.query(`
          SELECT
              v.id_vacante,
              v.titulo_cargo,
              COUNT(p.id_postulacion) AS total_postulaciones
          FROM
              vacantes v
          LEFT JOIN
              postulaciones p ON v.id_vacante = p.id_vacante
          GROUP BY
              v.id_vacante, v.titulo_cargo
          ORDER BY
              total_postulaciones DESC;
        `);

      res.status(200).json(result.rows);
    } catch (error) {
      console.error(
        "🔥 Error al obtener el conteo de postulaciones:",
        error.message
      );
      res.status(500).json({
        message:
          "❌ Error interno del servidor al obtener el conteo de postulaciones.",
        detail: error.message, // Puedes quitar esto en producción
      });
    }
  },
};
