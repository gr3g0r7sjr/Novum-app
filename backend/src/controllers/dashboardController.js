// backend/src/controllers/dashboardController.js
import pool from '../db.js'; // Importa el pool de conexiones desde db.js (ahora en la raíz de src)

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
      resumenUsuarios,
      postulacionesPorDia // <-- NUEVA CONSULTA
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
      `),
      // 7. NUEVA CONSULTA: Postulaciones por día en los últimos 7 días
      pool.query(`
        SELECT
          TO_CHAR(fecha_postulacion, 'YYYY-MM-DD') AS date,
          COUNT(*) AS count
        FROM
          postulaciones
        WHERE
          fecha_postulacion >= CURRENT_DATE - INTERVAL '6 days' -- Desde hace 6 días hasta hoy
        GROUP BY
          date
        ORDER BY
          date ASC;
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

    // Preparar datos para el gráfico de línea (Postulaciones por Período)
    // Generar un array con los últimos 7 días, inicializando en 0
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i)); // Obtiene el día actual - (6, 5, 4, 3, 2, 1, 0) días
      return {
        name: `${d.getDate()}/${d.getMonth() + 1}`, // Formato DD/MM para el nombre del día
        date_key: TO_CHAR(d, 'YYYY-MM-DD'), // Clave para mapear con los datos de la DB
        Postulaciones: 0
      };
    });

    // Mapear los datos reales de la DB a la estructura de los últimos 7 días
    postulacionesPorDia.rows.forEach(row => {
      const dayIndex = last7Days.findIndex(d => d.date_key === row.date);
      if (dayIndex !== -1) {
        last7Days[dayIndex].Postulaciones = parseInt(row.count, 10);
      }
    });


    res.status(200).json({
      totalVacantesActivas: parseInt(vacantesActivas, 10),
      totalVacantesInactivas: parseInt(vacantesInactivas, 10) + parseInt(vacantesCerradas, 10), // Suma inactivas y cerradas
      nuevasPostulacionesHoy: parseInt(nuevasPostulacionesHoy.rows[0]?.count || 0, 10),
      postulacionesEstaSemana: parseInt(postulacionesEstaSemana.rows[0]?.count || 0, 10),
      candidatosPorEtapa: postulacionesPorEtapa,
      vacantesMasPostulaciones: vacantesMasPostulaciones.map(v => ({ id: v.id_vacante, titulo: v.titulo_cargo, postulaciones: parseInt(v.total_postulaciones, 10) })),
      vacantesMenosPostulaciones: vacantesMenosPostulaciones.map(v => ({ id: v.id_vacante, titulo: v.titulo_cargo, postulaciones: parseInt(v.total_postulaciones, 10) })),
      resumenUsuarios: resumenUsuarios.rows.map(u => ({ rol: u.rol, count: parseInt(u.count, 10) })),
      postulacionesPorPeriodo: last7Days // <-- NUEVOS DATOS REALES PARA EL GRÁFICO DE LÍNEA
    });

  } catch (error) {
    console.error('🔥 Error al obtener métricas del dashboard:', error.message);
    res.status(500).json({ message: '❌ Error interno del servidor al cargar el dashboard.' });
  }
};
