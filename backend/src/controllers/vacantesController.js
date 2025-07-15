import pool from '../db.js'; 

export const vacantesController = {
    obtener: async (req, res) => {
        try {
            // Consulta SQL para obtener todas las vacantes activas
            // Incluye JOINs para obtener información relacionada como el correo del usuario creador
            // y el nombre del servicio de interés, si existen.
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
    // 1. Desestructurar correctamente todos los campos, incluyendo 'creado_por_usuario_id'
    const {
        titulo_cargo,
        area,
        descripcion_corta,
        responsabilidades,
        requisitos,
        beneficios,
        salario,
        creado_por_usuario_id, // ¡Asegúrate de que este campo venga en el body de Postman!
        id_servicio_interes
    } = req.body;

    // Objeto para acumular errores de validación
    const errors = {};

    // --- INICIO DE LA VALIDACIÓN DEL LADO DEL SERVIDOR ---

    // Validaciones de campos obligatorios y longitud mínima
    if (!titulo_cargo || typeof titulo_cargo !== 'string' || titulo_cargo.trim().length < 3) {
        errors.titulo_cargo = 'El título del cargo es obligatorio y debe tener al menos 3 caracteres.';
    }
    if (!area || typeof area !== 'string' || area.trim().length === 0) {
        errors.area = 'El área es obligatoria.';
    }
    if (!descripcion_corta || typeof descripcion_corta !== 'string' || descripcion_corta.trim().length < 10) {
        errors.descripcion_corta = 'La descripción corta es obligatoria y debe tener al menos 10 caracteres.';
    }
    if (!requisitos || !Array.isArray(requisitos) || requisitos.length === 0 || requisitos.some(r => typeof r !== 'string' || r.trim().length === 0)) {
        errors.requisitos = 'Los requisitos son obligatorios y deben ser una lista de cadenas no vacías.';
    }
    // Validación de creado_por_usuario_id (debe ser un número entero positivo)
    if (!creado_por_usuario_id || isNaN(parseInt(creado_por_usuario_id, 10)) || parseInt(creado_por_usuario_id, 10) <= 0) {
        errors.creado_por_usuario_id = 'El ID del usuario creador es obligatorio y debe ser un número entero positivo.';
    }

    // Validación de salario (si está presente, debe ser un número válido y no negativo)
    let parsedSalario = null;
    if (salario !== null && salario !== undefined && salario !== '') {
        // Limpiar el símbolo de moneda y comas antes de parsear
        const cleanSalario = String(salario).replace(/[^0-9.-]+/g,"");
        parsedSalario = parseFloat(cleanSalario);
        if (isNaN(parsedSalario) || parsedSalario < 0) {
            errors.salario = 'El salario debe ser un número válido y no negativo.';
        }
    }

    // Validación de id_servicio_interes (si está presente, debe ser un número entero positivo)
    let parsedIdServicioInteres = null;
    if (id_servicio_interes !== null && id_servicio_interes !== undefined && id_servicio_interes !== '') {
        parsedIdServicioInteres = parseInt(id_servicio_interes, 10);
        if (isNaN(parsedIdServicioInteres) || parsedIdServicioInteres <= 0) {
            errors.id_servicio_interes = 'El ID de servicio de interés no es válido.';
        }
    }

    // Si hay errores de validación, envía una respuesta 400 Bad Request
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: 'Errores de validación en los datos enviados.',
            errors: errors // Envía los errores específicos de vuelta al frontend
        });
    }
    // --- FIN DE LA VALIDACIÓN DEL LADO DEL SERVIDOR ---

    try {

        const checkDuplicateQuery = `
            SELECT id_vacante FROM vacantes
            WHERE titulo_cargo = $1 AND area = $2;
        `;
        const duplicateValues = [titulo_cargo.trim(), area.trim()];
        const duplicateResult = await pool.query(checkDuplicateQuery, duplicateValues);

        if (duplicateResult.rows.length > 0) {
            // Si se encuentra una vacante existente, devuelve un error 409 Conflict
            return res.status(409).json({
                message: 'Ya existe una vacante con el mismo título de cargo y área.',
                errors: {
                    titulo_cargo: 'Ya existe una vacante con este título en esta área.',
                    area: 'Ya existe una vacante con este título en esta área.'
                }
            });
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
            RETURNING *;`;

        // Los valores que se pasarán a la consulta, en el mismo orden que los placeholders
        const values = [
            titulo_cargo.trim(),
            area.trim(),
            descripcion_corta.trim(),
            // Convertir arrays a JSON strings para almacenar en columnas TEXT
            JSON.stringify(responsabilidades),
            JSON.stringify(requisitos),
            JSON.stringify(beneficios),
            // Usar el salario ya parseado o null
            parsedSalario,
            // Usar el ID de usuario creador ya validado
            parseInt(creado_por_usuario_id, 10),
            // Usar el ID de servicio de interés ya parseado o null
            parsedIdServicioInteres
        ];

        // Ejecuta la consulta usando el pool de conexiones
        const result = await pool.query(query, values);

        // Si la inserción fue exitosa, devuelve la vacante creada (desde RETURNING *)
        res.status(201).json({
            message: 'Vacante creada exitosamente!',
            vacante: result.rows[0] // La fila insertada
        });

    } catch (error) {
        console.error('Error al crear la vacante:', error);

        // Manejo de errores específicos de PostgreSQL
        if (error.code === '23503') { // Código de error para violación de clave foránea
            res.status(400).json({ message: 'Error: El ID de usuario creador o el ID de servicio de interés no existen.', detail: error.detail });
        } else if (error.code === '23502') { // Código de error para violación de NOT NULL
            res.status(400).json({ message: 'Error: Faltan campos obligatorios o son nulos.', detail: error.detail });
        } else {
            res.status(500).json({ message: 'Error interno del servidor al crear la vacante.' });
        }
    }
}
} 

