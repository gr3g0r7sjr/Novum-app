import pool from '../db/db.js';

/**
 * Controlador para crear una nueva vacante en la base de datos.
 * Se requiere que el usuario sea un administrador.
 */
export const crearVacante = async (req, res) => {
  // Extraemos los datos de la vacante del cuerpo de la solicitud.
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

  // El ID del usuario que crea la vacante se obtiene del token JWT.
  const creado_por_usuario_id = req.user.id;

  // Verificación de campos obligatorios.
  if (!titulo_cargo || !area || !descripcion_corta || !requisitos) {
    return res.status(400).json({ message: 'Los campos titulo_cargo, area, descripcion_corta y requisitos son obligatorios.' });
  }

  try {
    // Consulta SQL para insertar la nueva vacante.
    const query = `
      INSERT INTO public.vacantes (
        titulo_cargo, area, descripcion_corta, responsabilidades, 
        requisitos, beneficios, salario, creado_por_usuario_id, id_servicio_interes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      titulo_cargo, area, descripcion_corta, responsabilidades,
      requisitos, beneficios, salario, creado_por_usuario_id, id_servicio_interes
    ];

    const result = await pool.query(query, values);
    const nuevaVacante = result.rows[0];

    res.status(201).json({
      message: 'Vacante creada exitosamente.',
      vacante: nuevaVacante
    });

  } catch (error) {
    console.error('Error al crear la vacante:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear la vacante.' });
  }
};


// --- NUEVA FUNCIÓN AÑADIDA ---

/**
 * Controlador para listar todas las vacantes activas.
 * Esta función es pública y no requiere autenticación.
 * Realiza un JOIN con las tablas de usuarios e intereses para obtener más detalles.
 */
export const listarVacantes = async (req, res) => {
  try {
    // Consulta SQL para seleccionar todas las vacantes y unir la información
    // del usuario que la creó y el área de interés.
    // Filtramos por estado = 'activa' para mostrar solo las relevantes.
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
        u.correo_electronico AS creado_por,
        ie.nombre_interes AS servicio_de_interes
      FROM public.vacantes AS v
      LEFT JOIN public.usuarios AS u ON v.creado_por_usuario_id = u.id_usuario
      LEFT JOIN public.intereses_empresa AS ie ON v.id_servicio_interes = ie.id_interes
      WHERE v.estado = 'activa'
      ORDER BY v.fecha_publicacion DESC;
    `;

    // Ejecutamos la consulta.
    const result = await pool.query(query);

    // Respondemos con un estado 200 (OK) y la lista de vacantes.
    res.status(200).json(result.rows);

  } catch (error) {
    // Manejo de errores.
    console.error('Error al listar las vacantes:', error);
    res.status(500).json({ message: 'Error interno del servidor al listar las vacantes.' });
  }
};