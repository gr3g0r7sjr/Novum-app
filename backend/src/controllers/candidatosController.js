import pool from "../db.js"; // Usa import para ES6

// Función auxiliar para calcular el "match score" en porcentaje
// Calcula qué porcentaje de los requisitos de la vacante son cubiertos por el candidato.
const calcularMatchScore = (candidato, vacante) => {
  let matchedRequirementsCount = 0;
  // Asegúrate de que vacante.requisitos es un array y convierte a minúsculas para comparación.
  const vacanteRequisitos = vacante.requisitos
    ? vacante.requisitos.map((req) => req.toLowerCase())
    : [];
  const totalVacanteRequisitos = vacanteRequisitos.length;

  // Si no hay requisitos en la vacante, el score es 0%
  if (totalVacanteRequisitos === 0) {
    return 0;
  }

  // Itera sobre cada requisito de la vacante
  vacanteRequisitos.forEach((req) => {
    let foundInCandidate = false;

    // 1. Buscar el requisito en las habilidades del candidato (TEXT[])
    // Las habilidades son un array de strings, así que usamos includes en cada habilidad.
    if (candidato.habilidades && Array.isArray(candidato.habilidades)) {
      if (
        candidato.habilidades.some(
          (habilidad) => habilidad && habilidad.toLowerCase().includes(req)
        )
      ) {
        foundInCandidate = true;
      }
    }

    // 2. Buscar el requisito en la educación del candidato (JSONB)
    // Solo si no se encontró ya en habilidades para este requisito
    if (
      !foundInCandidate &&
      candidato.educacion &&
      Array.isArray(candidato.educacion)
    ) {
      if (
        candidato.educacion.some(
          (edu) =>
            (edu.institucion && edu.institucion.toLowerCase().includes(req)) ||
            (edu.titulo && edu.titulo.toLowerCase().includes(req))
        )
      ) {
        foundInCandidate = true;
      }
    }

    // 3. Buscar el requisito en la experiencia laboral del candidato (JSONB)
    // Solo si no se encontró ya en habilidades o educación para este requisito
    if (
      !foundInCandidate &&
      candidato.experiencia_laboral &&
      Array.isArray(candidato.experiencia_laboral)
    ) {
      if (
        candidato.experiencia_laboral.some(
          (exp) =>
            (exp.empresa && exp.empresa.toLowerCase().includes(req)) ||
            (exp.puesto && exp.puesto.toLowerCase().includes(req)) ||
            (exp.descripcion && exp.descripcion.toLowerCase().includes(req))
        )
      ) {
        foundInCandidate = true;
      }
    }

    // Si el requisito se encontró en alguna parte del perfil del candidato, incrementa el contador
    if (foundInCandidate) {
      matchedRequirementsCount++;
    }
  });

  // Calcula el porcentaje
  const percentage = (matchedRequirementsCount / totalVacanteRequisitos) * 100;
  // Redondea a 2 decimales para una mejor presentación
  return parseFloat(percentage.toFixed(2));
};

const candidatosController = {
  // Obtener todos los candidatos (opcionalmente con filtros)
  getCandidatos: async (req, res) => {
    try {
      // Puedes añadir lógica de filtrado, paginación, etc. aquí
      const result = await pool.query(`
        SELECT
            id_candidato,
            nombre,
            apellido,
            correo_electronico,
            numero_telefono,
            direccion,
            tipo_identificacion,
            cedula,
            TO_CHAR(fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento,
            educacion,
            experiencia_laboral,
            cursos_certificaciones,
            habilidades,
            servicio_interes,
            vehiculo,
            TO_CHAR(fecha_postulacion_inicial, 'YYYY-MM-DD HH24:MI:SS') AS fecha_postulacion_inicial
        FROM
            public.candidatos
        ORDER BY
            fecha_postulacion_inicial DESC;
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("🔥 Error al obtener candidatos:", error.message);
      res.status(500).json({
        message: "❌ Error interno del servidor al obtener los candidatos.",
        detail: error.message,
      });
    }
  },

  // Obtener un candidato por ID
  getCandidatoById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `
        SELECT
            id_candidato,
            nombre,
            apellido,
            correo_electronico,
            numero_telefono,
            direccion,
            tipo_identificacion,
            cedula,
            TO_CHAR(fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento,
            educacion,
            experiencia_laboral,
            cursos_certificaciones,
            habilidades,
            servicio_interes,
            vehiculo,
            TO_CHAR(fecha_postulacion_inicial, 'YYYY-MM-DD HH24:MI:SS') AS fecha_postulacion_inicial
        FROM
            public.candidatos
        WHERE
            id_candidato = $1;
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Candidato no encontrado." });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(
        `🔥 Error al obtener candidato con ID ${id}:`,
        error.message
      );
      res.status(500).json({
        message: "❌ Error interno del servidor al obtener el candidato.",
        detail: error.message,
      });
    }
  },

  // Crear un nuevo candidato (directamente, no a través de una postulación)
  createCandidato: async (req, res) => {
    const {
      nombre,
      apellido,
      correo_electronico,
      numero_telefono,
      direccion,
      tipo_identificacion,
      cedula,
      fecha_nacimiento,
      educacion,
      experiencia_laboral,
      cursos_certificaciones,
      habilidades,
      servicio_interes,
      vehiculo,
    } = req.body;

    // Validaciones básicas
    if (
      !nombre ||
      !apellido ||
      !correo_electronico ||
      !tipo_identificacion ||
      !cedula ||
      !fecha_nacimiento
    ) {
      return res.status(400).json({
        message:
          "Nombre, apellido, correo electrónico, tipo de identificación, cédula y fecha de nacimiento son requeridos.",
      });
    }

    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      // Verificar si el correo o la cédula ya existen
      const existingCandidate = await client.query(
        "SELECT id_candidato FROM public.candidatos WHERE correo_electronico = $1 OR (tipo_identificacion = $2 AND cedula = $3)",
        [correo_electronico, tipo_identificacion, cedula]
      );
      if (existingCandidate.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          message: "Ya existe un candidato con este correo o cédula.",
        });
      }

      // Preparación de habilidades para TEXT[]
      const habilidadesArrayDeStrings = Array.isArray(habilidades)
        ? habilidades.map((h) => h.nombre)
        : [];

      const result = await client.query(
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
          educacion, // JSONB
          experiencia_laboral, // JSONB
          cursos_certificaciones, // JSONB
          habilidadesArrayDeStrings, // TEXT[]
          servicio_interes,
          vehiculo,
          tipo_identificacion,
          cedula,
          fecha_nacimiento,
        ]
      );

      await client.query("COMMIT");
      res.status(201).json({
        message: "✅ Candidato registrado exitosamente.",
        candidato: result.rows[0],
      });
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK");
      }
      console.error("🔥 Error al crear candidato:", error.message);
      res.status(500).json({
        message: "❌ Error interno del servidor al crear el candidato.",
        detail: error.message,
      });
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  // Actualizar un candidato por ID
  updateCandidato: async (req, res) => {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      correo_electronico,
      numero_telefono,
      direccion,
      tipo_identificacion,
      cedula,
      fecha_nacimiento,
      educacion,
      experiencia_laboral,
      cursos_certificaciones,
      habilidades,
      servicio_interes,
      vehiculo,
    } = req.body;

    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const currentCandidato = await client.query(
        "SELECT * FROM public.candidatos WHERE id_candidato = $1",
        [id]
      );
      if (currentCandidato.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Candidato no encontrado." });
      }

      // Preparación de habilidades para TEXT[]
      const habilidadesArrayDeStrings = Array.isArray(habilidades)
        ? habilidades.map((h) => h.nombre)
        : [];

      const result = await client.query(
        `UPDATE public.candidatos SET
            nombre = COALESCE($1, nombre),
            apellido = COALESCE($2, apellido),
            correo_electronico = COALESCE($3, correo_electronico),
            numero_telefono = COALESCE($4, numero_telefono),
            direccion = COALESCE($5, direccion),
            educacion = COALESCE($6, educacion),
            experiencia_laboral = COALESCE($7, experiencia_laboral),
            cursos_certificaciones = COALESCE($8, cursos_certificaciones),
            habilidades = COALESCE($9, habilidades),
            servicio_interes = COALESCE($10, servicio_interes),
            vehiculo = COALESCE($11, vehiculo),
            tipo_identificacion = COALESCE($12, tipo_identificacion),
            cedula = COALESCE($13, cedula),
            fecha_nacimiento = COALESCE($14, fecha_nacimiento)
        WHERE id_candidato = $15 RETURNING *`,
        [
          nombre,
          apellido,
          correo_electronico,
          numero_telefono,
          direccion,
          educacion,
          experiencia_laboral,
          cursos_certificaciones,
          habilidadesArrayDeStrings,
          servicio_interes,
          vehiculo,
          tipo_identificacion,
          cedula,
          fecha_nacimiento,
          id,
        ]
      );

      await client.query("COMMIT");
      res.status(200).json({
        message: "✅ Candidato actualizado exitosamente.",
        candidato: result.rows[0],
      });
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK");
      }
      console.error(
        `🔥 Error al actualizar candidato con ID ${id}:`,
        error.message
      );
      res.status(500).json({
        message: "❌ Error interno del servidor al actualizar el candidato.",
        detail: error.message,
      });
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  // Eliminar un candidato por ID
  deleteCandidato: async (req, res) => {
    const { id } = req.params;
    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const result = await client.query(
        "DELETE FROM public.candidatos WHERE id_candidato = $1 RETURNING *",
        [id]
      );

      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Candidato no encontrado." });
      }

      await client.query("COMMIT");
      res.status(200).json({
        message: "✅ Candidato eliminado exitosamente.",
        candidato: result.rows[0],
      });
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK");
      }
      console.error(
        `🔥 Error al eliminar candidato con ID ${id}:`,
        error.message
      );
      res.status(500).json({
        message: "❌ Error interno del servidor al eliminar el candidato.",
        detail: error.message,
      });
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  // Nuevo método para obtener postulaciones con un score de coincidencia en porcentaje
  // Este método ahora reside en candidatosController.js
  getCandidatosPorVacanteConMatch: async (req, res) => {
    const { id_vacante } = req.query; // Filtrar por vacante específica

    try {
      let queryText = `
          SELECT
              p.id_postulacion,
              p.fecha_postulacion,
              p.estado_postulacion,
              c.id_candidato,
              c.nombre AS candidato_nombre,
              c.apellido AS candidato_apellido,
              c.correo_electronico,
              c.tipo_identificacion,
              c.cedula,
              TO_CHAR(c.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento,
              c.numero_telefono,
              c.direccion,
              c.educacion,            -- JSONB
              c.experiencia_laboral,  -- JSONB
              c.cursos_certificaciones, -- JSONB
              c.habilidades,          -- TEXT[]
              si.nombre_interes AS servicio_interes_nombre, -- Corregido el alias para que coincida con el frontend
              c.vehiculo,
              v.id_vacante,
              v.titulo_cargo AS vacante_titulo,
              v.descripcion_corta AS vacante_descripcion_corta,
              v.responsabilidades AS vacante_responsabilidades,
              v.requisitos AS vacante_requisitos,
              v.beneficios AS vacante_beneficios,
              v.salario AS vacante_salario
          FROM
              postulaciones p
          JOIN
              public.candidatos c ON p.id_candidato = c.id_candidato
          JOIN
              vacantes v ON p.id_vacante = v.id_vacante
          LEFT JOIN
              intereses_empresa si ON c.servicio_interes = si.id_interes -- ¡CORREGIDO AQUÍ: intereses_empresa!
      `;
      const queryParams = [];

      if (id_vacante) {
        queryText += ` WHERE p.id_vacante = $1`;
        queryParams.push(id_vacante);
      }

      queryText += ` ORDER BY p.fecha_postulacion DESC;`;

      const result = await pool.query(queryText, queryParams);

      // Calcular el match score para cada postulación
      const postulacionesConScore = result.rows.map((row) => {
        const candidatoData = {
          nombre: row.candidato_nombre,
          apellido: row.candidato_apellido,
          correo_electronico: row.correo_electronico,
          educacion: row.educacion,
          experiencia_laboral: row.experiencia_laboral,
          cursos_certificaciones: row.cursos_certificaciones,
          habilidades: row.habilidades,
        };
        const vacanteData = {
          titulo_cargo: row.vacante_titulo,
          area: row.vacante_area,
          descripcion_corta: row.vacante_descripcion_corta,
          responsabilidades: row.responsabilidades,
          requisitos: row.requisitos,
        };

        const match_score = calcularMatchScore(candidatoData, vacanteData);
        return { ...row, match_score };
      });

      // Ordenar por match_score de forma descendente
      postulacionesConScore.sort((a, b) => b.match_score - a.match_score);

      res.status(200).json(postulacionesConScore);
    } catch (error) {
      console.error(
        "🔥 Error al obtener postulaciones con match score:",
        error.message
      );
      res.status(500).json({
        message:
          "❌ Error interno del servidor al obtener las postulaciones con match score.",
        detail: error.message,
      });
    }
  },
};

export { candidatosController };
