// backend/controllers/postulacionesController.js
import pool from '../config/db.js'; // Importa el pool de conexiones con la extensión .js

/**
 * @description: Permite a un candidato postularse a una vacante.
 * Es la lógica para la API "applyVacante".
 * @route POST /api/postulaciones
 * @access Public
 */
export const aplicarVacante = async (req, res) => {
  const {
    id_candidato,
    id_vacante,
    nombre, apellido, correo_electronico, numero_telefono,
    direccion, educacion, experiencia_laboral, cursos_certificaciones,
    habilidades, servicio_interes, vehiculo
  } = req.body;

  try {
    // 1. Validar id_vacante
    if (!id_vacante) {
      return res.status(400).json({ message: 'El ID de la vacante es requerido.' });
    }
    const vacanteCheck = await pool.query('SELECT 1 FROM vacantes WHERE id_vacante = $1', [id_vacante]);
    if (vacanteCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Vacante no encontrada.' });
    }

    let candidatoIdFinal = id_candidato;

    // 2. Si no se proporciona id_candidato, se asume que es un nuevo candidato
    // y se insertan sus datos.
    if (!id_candidato) {
      // Validación básica para el nuevo candidato
      if (!nombre || !apellido || !correo_electronico) {
        return res.status(400).json({ message: 'Para una nueva postulación, nombre, apellido y correo electrónico son requeridos.' });
      }

      // Opcional: Verificar si el correo ya existe en candidatos para evitar duplicados
      const existingCandidate = await pool.query('SELECT id_candidato FROM public.candidatos WHERE correo_electronico = $1', [correo_electronico]);
      if (existingCandidate.rows.length > 0) {
        // Si el candidato ya existe, usamos su ID existente
        candidatoIdFinal = existingCandidate.rows[0].id_candidato;
        console.log(`Candidato con correo ${correo_electronico} ya existe, usando ID: ${candidatoIdFinal}`);
      } else {
        // Insertar nuevo candidato
        const newCandidatoResult = await pool.query(
          `INSERT INTO public.candidatos (
            nombre, apellido, correo_electronico, numero_telefono, direccion,
            educacion, experiencia_laboral, cursos_certificaciones, habilidades,
            servicio_interes, vehiculo
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id_candidato`,
          [
            nombre, apellido, correo_electronico, numero_telefono, direccion,
            educacion, experiencia_laboral, cursos_certificaciones, habilidades,
            servicio_interes, vehiculo
          ]
        );
        candidatoIdFinal = newCandidatoResult.rows[0].id_candidato;
        console.log(`Nuevo candidato registrado con ID: ${candidatoIdFinal}`);
      }
    } else {
      // Si se proporciona id_candidato, verificar que exista
      const candidatoCheck = await pool.query('SELECT 1 FROM candidatos WHERE id_candidato = $1', [id_candidato]);
      if (candidatoCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Candidato existente no encontrado con el ID proporcionado.' });
      }
    }

    // 3. Verificar si la postulación ya existe para evitar duplicados
    const existingPostulacion = await pool.query(
      'SELECT 1 FROM postulaciones WHERE id_candidato = $1 AND id_vacante = $2',
      [candidatoIdFinal, id_vacante]
    );

    if (existingPostulacion.rows.length > 0) {
      return res.status(409).json({ message: 'El candidato ya se ha postulado a esta vacante.' });
    }

    // 4. Insertar la nueva postulación
    const result = await pool.query(
      'INSERT INTO postulaciones (id_candidato, id_vacante) VALUES ($1, $2) RETURNING *',
      [candidatoIdFinal, id_vacante]
    );

    res.status(201).json({
      message: '✅ Postulación registrada exitosamente.',
      postulacion: result.rows[0]
    });

  } catch (error) {
    console.error('🔥 Error al aplicar a la vacante:', error.message);
    res.status(500).json({ message: '❌ Error interno del servidor al procesar la postulación.' });
  }
};

/**
 * @description: Obtiene todas las postulaciones.
 * @route GET /api/postulaciones
 * @access Public (Debería ser privada en producción)
 */
export const getPostulaciones = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                p.id_postulacion,
                p.fecha_postulacion,
                p.estado_postulacion,
                c.nombre AS candidato_nombre,
                c.apellido AS candidato_apellido,
                c.correo_electronico,
                v.titulo_cargo AS vacante_titulo,
                v.area AS vacante_area
            FROM
                postulaciones p
            JOIN
                candidatos c ON p.id_candidato = c.id_candidato
            JOIN
                vacantes v ON p.id_vacante = v.id_vacante
            ORDER BY
                p.fecha_postulacion DESC;
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('🔥 Error al obtener postulaciones:', error.message);
        res.status(500).json({ message: '❌ Error interno del servidor al obtener las postulaciones.' });
    }
};