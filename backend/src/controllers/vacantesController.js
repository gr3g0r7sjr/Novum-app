import pool from '../db.js'; 

export const vacantesController = {
    obtener: async (req, res) => {
        try {
            const query = `
                SELECT
                    v.id_vacante,
                    v.titulo_cargo,
                    v.area,
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
            console.error('Error al obtener vacantes:', error);
            // Envía una respuesta de error 500 al cliente
            res.status(500).json({ message: 'Error interno del servidor al obtener vacantes.' });
        }
    },

    crear: async (req, res) => {
        const {
            titulo_cargo, area, descripcion_corta,
            responsabilidades, requisitos, beneficios,
            salario, id_servicio_interes
        } = req.body;

        const creado_por_usuario_id = req.user ? req.user.id : null;

        const errors = {};

        // Validación de creado_por_usuario_id (se mantiene para capturar si es null o no numérico)
        if (!creado_por_usuario_id || isNaN(parseInt(creado_por_usuario_id, 10)) || parseInt(creado_por_usuario_id, 10) <= 0) {
            errors.creado_por_usuario_id = 'El ID del usuario creador es obligatorio y debe ser un número entero positivo.';
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: 'Errores de validación en los datos enviados.',
                errors: errors
            });
        }

        try {
            const query = `
                INSERT INTO vacantes (
                    titulo_cargo, area, descripcion_corta, responsabilidades,
                    requisitos, beneficios, salario, creado_por_usuario_id, id_servicio_interes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *;`;

            const values = [
                titulo_cargo.trim(),
                area.trim(),
                descripcion_corta.trim(),
                JSON.stringify(responsabilidades),
                JSON.stringify(requisitos),
                JSON.stringify(beneficios),
                salario === '' ? null : parseFloat(String(salario).replace(/[^0-9.-]+/g,"")),
                parseInt(creado_por_usuario_id, 10), // Asegúrate de que este ID sea válido
                id_servicio_interes === '' ? null : parseInt(id_servicio_interes, 10)
            ];

            const result = await pool.query(query, values);

            res.status(201).json({
                message: 'Vacante creada exitosamente!',
                vacante: result.rows[0]
            });

        } catch (error) {
            console.error('Error al crear la vacante:', error);

            if (error.code === '23503') {
                res.status(400).json({ message: 'Error: El ID de usuario creador o el ID de servicio de interés no existen.', detail: error.detail });
            } else if (error.code === '23502') {
                res.status(400).json({ message: 'Error: Faltan campos obligatorios o son nulos.', detail: error.detail });
            } else {
                res.status(500).json({ message: 'Error interno del servidor al crear la vacante.' });
            }
        }
    },
    obtenerServiciosInteres: async (req, res) => {
        try {
            // Consulta SQL para obtener todos los servicios de interés
            const query = 'SELECT id_interes, nombre_interes FROM intereses_empresa ORDER BY nombre_interes;';
            const result = await pool.query(query);

            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error al obtener servicios de interés:', error);
            res.status(500).json({ message: 'Error interno del servidor al cargar servicios de interés.' });
        }
    },
    obtenerVacanteId: async (req, res) => {
        const {id} = req.params
        try {
            const result = await pool.query('SELECT * FROM vacantes WHERE id_vacante = $1', [id]);
            if (result.rows.length > 0) {
                res.json(result.rows[0]); 
            } else {
                res.status(404).json({ message: 'Vacante no encontrada' });
            }
        } catch (err) {
            console.error(`Error al obtener vacante con ID ${id}:`, err);
            res.status(500).json({ message: 'Error interno del servidor al obtener la vacante.' });
        }
    }
    
} 