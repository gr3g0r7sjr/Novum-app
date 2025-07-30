// backend/src/controllers/dashboardController.js
import pool from '../config/db.js'; // Importa el pool de conexiones

/**
 * @description: Obtiene todas las métricas y datos necesarios para el dashboard de RRHH.
 * @route GET /api/dashboard/metrics
 * @access Private (Requiere autenticación de RRHH)
 */
export const getDashboardMetrics = async (req, res) => {
  try {
    // Usamos Promise.all para ejecutar todas las consultas de forma concurrente
    const [
      vacantesStatus,
      nuevasPostulacionesHoy,
      postulacionesEstaSemana,
      candidatosPorEtapa,
      vacantesPostulacionesCount,
      resumenUsuarios
    ] = await Promise.all([
      // 1. Total de vacantes activas/inactivas
      pool.query(`
        SELECT
          estado,
          COUNT(*) AS count
        FROM
          vacantes
        GROUP BY
          estado;
      `),
      // 2. Nuevas postulaciones hoy
      pool.query(`
        SELECT
          COUNT(*) AS count
        FROM
          postulaciones
        WHERE
          fecha_postulacion >= CURRENT_DATE AND fecha_postulacion < CURRENT_DATE + INTERVAL '1 day';
      `),
      // 3. Postulaciones esta semana (últimos 7 días)
      pool.query(`
        SELECT
          COUNT(*) AS count
        FROM
          postulaciones
        WHERE
          fecha_postulacion >= CURRENT_DATE - INTERVAL '7 days';
      `),
      // 4. Candidatos por etapa (estado_postulacion)
      pool.query(`
        SELECT
          estado_postulacion,
          COUNT(*) AS count
        FROM
          postulaciones
        GROUP BY
          estado_postulacion;
      `),
      // 5. Conteo de postulaciones por vacante (para las más/menos postuladas)
      pool.query(`
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
      `),
      // 6. Resumen de usuarios (ej. total de usuarios, roles)
      pool.query(`
        SELECT
          rol,
          COUNT(*) AS count
        FROM
          usuarios
        GROUP BY
          rol;
      `)
    ]);

    // Procesar los resultados
    const vacantesActivas = vacantesStatus.rows.find(row => row.estado === 'activa')?.count || 0;
    const vacantesInactivas = vacantesStatus.rows.find(row => row.estado === 'inactiva')?.count || 0;
    const vacantesCerradas = vacantesStatus.rows.find(row => row.estado === 'cerrada')?.count || 0; // Si tienes estado 'cerrada'

    const postulacionesPorEtapa = candidatosPorEtapa.rows.reduce((acc, curr) => {
      acc[curr.estado_postulacion] = parseInt(curr.count, 10);
      return acc;
    }, {
      recibida: 0,
      enRevision: 0,
      entrevista: 0,
      contratado: 0,
      rechazado: 0,
      // Asegúrate de incluir todos los estados posibles de tu DB
    });

    const vacantesConPostulaciones = vacantesPostulacionesCount.rows;
    const vacantesMasPostulaciones = vacantesConPostulaciones.slice(0, 5); // Top 5
    const vacantesMenosPostulaciones = vacantesConPostulaciones.slice(-5).reverse(); // Bottom 5

    res.status(200).json({
      totalVacantesActivas: parseInt(vacantesActivas, 10),
      totalVacantesInactivas: parseInt(vacantesInactivas, 10) + parseInt(vacantesCerradas, 10), // Suma inactivas y cerradas
      nuevasPostulacionesHoy: parseInt(nuevasPostulacionesHoy.rows[0]?.count || 0, 10),
      postulacionesEstaSemana: parseInt(postulacionesEstaSemana.rows[0]?.count || 0, 10),
      candidatosPorEtapa: postulacionesPorEtapa,
      vacantesMasPostulaciones: vacantesMasPostulaciones.map(v => ({ id: v.id_vacante, titulo: v.titulo_cargo, postulaciones: parseInt(v.total_postulaciones, 10) })),
      vacantesMenosPostulaciones: vacantesMenosPostulaciones.map(v => ({ id: v.id_vacante, titulo: v.titulo_cargo, postulaciones: parseInt(v.total_postulaciones, 10) })),
      resumenUsuarios: resumenUsuarios.rows.map(u => ({ rol: u.rol, count: parseInt(u.count, 10) })),
    });

  } catch (error) {
    console.error('🔥 Error al obtener métricas del dashboard:', error.message);
    res.status(500).json({ message: '❌ Error interno del servidor al cargar el dashboard.' });
  }
};