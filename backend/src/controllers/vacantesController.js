// backend/src/controllers/vacantesController.js
import pool from '../db.js'; // db.js está en el mismo nivel que la carpeta controllers, subimos un nivel para accederlo

/**
 * Obtiene todas las vacantes activas de la base de datos.
 */
export const obtenerVacantes = async (req, res) => {
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
                u.correo_electronico AS creado_por_correo,
                v.id_servicio_interes,
                ie.nombre_interes AS nombre_servicio_interes
            FROM
                vacantes v
            JOIN
                usuarios u ON v.creado_por_usuario_id = u.id_usuario
            LEFT JOIN
                intereses_empresa ie ON v.id_servicio_interes = ie.id_interes
            WHERE
                v.estado = 'activa'
            ORDER BY
                v.fecha_publicacion DESC;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener vacantes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener vacantes.' });
    }
};

/**
 * Crea una nueva vacante en la base de datos.
 */
export const crearVacante = async (req, res) => {
    const {
        titulo_cargo,
        area,
        descripcion_corta,
        responsabilidades,
        requisitos,
        beneficios,
        salario,
        id_servicio_interes
    } = req.body;

    // TODO: En un entorno real, el creado_por_usuario_id vendría del token de autenticación.
    const creado_por_usuario_id = 1; // Usar ID 1 para pruebas, asegúrate de que exista en tu DB

    try {
        if (!titulo_cargo || !area || !descripcion_corta || !requisitos || !creado_por_usuario_id) {
            return res.status(400).json({ message: 'Faltan campos obligatorios para crear la vacante.' });
        }

        const query = `
            INSERT INTO vacantes (
                titulo_cargo,
                area,
                descripcion_corta,
                responsabilidades,
                requisitos,
                beneficios,
                salario,
                creado_por_usuario_id,
                id_servicio_interes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
            creado_por_usuario_id,
            id_servicio_interes
        ];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Vacante creada exitosamente', vacante: result.rows[0] });

    } catch (error) {
        console.error('Error al crear vacante:', error);
        if (error.code === '23503') { // Foreign key violation
            return res.status(400).json({ message: 'El ID de usuario creador o el ID de servicio de interés no son válidos.', error: error.detail });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear vacante.' });
    }
};