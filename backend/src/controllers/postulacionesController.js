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
      educacion,
      experiencia_laboral,
      cursos_certificaciones,
      habilidades,
      servicio_interes,
      vehiculo,
      tipo_identificacion,
      cedula,
      fecha_nacimiento,
    } = req.body;

    let client;

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
        } else {
          const habilidadesArrayDeStrings = Array.isArray(habilidades)
            ? habilidades.map((h) => h.nombre)
            : [];

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
              c.educacion,
              c.experiencia_laboral,
              c.cursos_certificaciones,
              c.habilidades,
              si.nombre_interes AS nombre_interes,
              c.vehiculo,
              v.titulo_cargo AS vacante_titulo
          FROM
              postulaciones p
          JOIN
              public.candidatos c ON p.id_candidato = c.id_candidato
          JOIN
              vacantes v ON p.id_vacante = v.id_vacante
          LEFT JOIN
              intereses_empresa si ON c.servicio_interes = si.id_interes -- ¡CORREGIDO AQUÍ!
          ORDER BY
              p.fecha_postulacion DESC;
        `);

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
