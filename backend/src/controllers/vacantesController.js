import pool from "../db.js";

export const vacantesController = {
  obtener: async (req, res) => {
    try {
      const query = `
                SELECT
                    v.id_vacante,
                    v.titulo_cargo,
                    v.descripcion_corta,
                    v.responsabilidades,
                    v.requisitos,
                    v.beneficios,
                    v.salario,
                    v.fecha_publicacion,
                    v.estado,
                    v.creado_por_usuario_id,
                    v.id_servicio_interes,
                    ie.nombre_interes AS nombre_servicio_interes
                FROM
                    vacantes v
                JOIN
                    usuarios u ON v.creado_por_usuario_id = u.id_usuario
                LEFT JOIN
                    intereses_empresa ie ON v.id_servicio_interes = ie.id_interes
                WHERE
                    v.estado = 'activa' -- Solo queremos las vacantes que están activas
                ORDER BY
                    v.fecha_publicacion DESC; -- Ordena las vacantes por fecha de publicación descendente
            `;

      // Ejecuta la consulta en la base de datos
      const result = await pool.query(query);

      // Envía las filas obtenidas como respuesta JSON con un estado 200 OK
      res.status(200).json(result.rows);
    } catch (error) {
      // Captura y registra cualquier error que ocurra durante la consulta
      console.error("Error al obtener vacantes:", error);
      // Envía una respuesta de error 500 al cliente
      res
        .status(500)
        .json({ message: "Error interno del servidor al obtener vacantes." });
    }
  },

  crear: async (req, res) => {
    const {
      titulo_cargo,
      descripcion_corta,
      responsabilidades,
      requisitos,
      beneficios,
      salario,
      id_servicio_interes,
    } = req.body;

    const creado_por_usuario_id = req.user ? req.user.id : null;

    const errors = {};

    if (
      !creado_por_usuario_id ||
      isNaN(parseInt(creado_por_usuario_id, 10)) ||
      parseInt(creado_por_usuario_id, 10) <= 0
    ) {
      errors.creado_por_usuario_id =
        "El ID del usuario creador es obligatorio y debe ser un número entero positivo.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Errores de validación en los datos enviados.",
        errors: errors,
      });
    }

    try {
      const query = `
                INSERT INTO vacantes (
                    titulo_cargo, descripcion_corta, responsabilidades,
                    requisitos, beneficios, salario, creado_por_usuario_id, id_servicio_interes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;`;

      const values = [
        titulo_cargo.trim(),
        descripcion_corta.trim(),
        responsabilidades,
        requisitos,
        beneficios,
        salario === ""
          ? null
          : parseFloat(String(salario).replace(/[^0-9.-]+/g, "")),
        parseInt(creado_por_usuario_id, 10),
        id_servicio_interes === "" ? null : parseInt(id_servicio_interes, 10),
      ];

      const result = await pool.query(query, values);

      res.status(201).json({
        message: "Vacante creada exitosamente!",
        vacante: result.rows[0],
      });
    } catch (error) {
      console.error("Error al crear la vacante:", error);

      if (error.code === "23503") {
        res.status(400).json({
          message:
            "Error: El ID de usuario creador o el ID de servicio de interés no existen.",
          detail: error.detail,
        });
      } else if (error.code === "23502") {
        res.status(400).json({
          message: "Error: Faltan campos obligatorios o son nulos.",
          detail: error.detail,
        });
      } else {
        res
          .status(500)
          .json({ message: "Error interno del servidor al crear la vacante." });
      }
    }
  },

  obtenerServiciosInteres: async (req, res) => {
    try {
      const query =
        "SELECT id_interes, nombre_interes FROM intereses_empresa ORDER BY nombre_interes;";
      const result = await pool.query(query);

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error al obtener servicios de interés:", error);
      res.status(500).json({
        message: "Error interno del servidor al cargar servicios de interés.",
      });
    }
  },

  obtenerVacanteId: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "SELECT * FROM vacantes WHERE id_vacante = $1",
        [id]
      );
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: "Vacante no encontrada" });
      }
    } catch (err) {
      console.error(`Error al obtener vacante con ID ${id}:`, err);
      res
        .status(500)
        .json({ message: "Error interno del servidor al obtener la vacante." });
    }
  },

  // 👇 NUEVOS MÉTODOS AÑADIDOS

  actualizar: async (req, res) => {
    const { id } = req.params;
    const {
      titulo_cargo,
      area,
      descripcion_corta,
      responsabilidades,
      requisitos,
      beneficios,
      salario,
      estado,
      id_servicio_interes,
    } = req.body;

    try {
      const query = `
                UPDATE vacantes
                SET 
                    titulo_cargo = COALESCE($1, titulo_cargo),
                    area = COALESCE($2, area),
                    descripcion_corta = COALESCE($3, descripcion_corta),
                    responsabilidades = COALESCE($4, responsabilidades),
                    requisitos = COALESCE($5, requisitos),
                    beneficios = COALESCE($6, beneficios),
                    salario = COALESCE($7, salario),
                    estado = COALESCE($8, estado),
                    id_servicio_interes = COALESCE($9, id_servicio_interes)
                WHERE id_vacante = $10
                RETURNING *;
            `;

      const values = [
        titulo_cargo,
        area,
        descripcion_corta,
        responsabilidades,
        requisitos,
        beneficios,
        salario,
        estado,
        id_servicio_interes,
        id,
      ];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Vacante no encontrada para actualizar.",
        });
      }

      res.status(200).json({
        message: "Vacante actualizada exitosamente.",
        vacante: result.rows[0],
      });
    } catch (error) {
      console.error("Error al actualizar la vacante:", error);
      res.status(500).json({
        message: "Error interno del servidor al actualizar la vacante.",
      });
    }
  },

  eliminar: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query(
        "DELETE FROM vacantes WHERE id_vacante = $1 RETURNING *",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Vacante no encontrada para eliminar.",
        });
      }

      res.status(200).json({
        message: "Vacante eliminada exitosamente.",
        vacante: result.rows[0],
      });
    } catch (error) {
      console.error("Error al eliminar la vacante:", error);
      res.status(500).json({
        message: "Error interno del servidor al eliminar la vacante.",
      });
    }
  },
};
