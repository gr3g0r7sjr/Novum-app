// frontend/src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/Dashboard.module.scss'; // Ruta ajustada
import MetricCard from '../../components/Dashboard/MetricCard'; // Ruta ajustada
import PlaceholderChart from '../../components/Charts/PlaceholderChart'; // Ruta ajustada

const Dashboard = () => {
  // Estado para almacenar los datos del dashboard
  const [dashboardData, setDashboardData] = useState({
    totalVacantesActivas: 0,
    totalVacantesInactivas: 0,
    nuevasPostulacionesHoy: 0,
    postulacionesEstaSemana: 0,
    candidatosPorEtapa: {
      recibida: 0,
      enRevision: 0,
      entrevista: 0,
      contratado: 0,
      rechazado: 0,
    },
    vacantesMasPostulaciones: [],
    vacantesMenosPostulaciones: [],
    resumenUsuarios: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aquí es donde haríamos las llamadas a la API para obtener los datos.
    // Por ahora, simularemos una carga de datos.
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulación de una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula un retraso de red

        const mockData = {
          totalVacantesActivas: 15,
          totalVacantesInactivas: 5,
          nuevasPostulacionesHoy: 7,
          postulacionesEstaSemana: 45,
          candidatosPorEtapa: {
            recibida: 200,
            enRevision: 80,
            entrevista: 30,
            contratado: 10,
            rechazado: 50,
          },
          vacantesMasPostulaciones: [
            { id: 1, titulo: 'Desarrollador Frontend', postulaciones: 60 },
            { id: 2, titulo: 'Especialista en Marketing', postulaciones: 45 },
          ],
          vacantesMenosPostulaciones: [
            { id: 3, titulo: 'Diseñador UI/UX', postulaciones: 5 },
            { id: 4, titulo: 'Analista de Datos', postulaciones: 8 },
          ],
          resumenUsuarios: [
            { id: 1, nombre: 'Admin Uno', rol: 'admin' },
            { id: 2, nombre: 'RRHH Manager', rol: 'recursos_humanos' },
          ],
        };
        setDashboardData(mockData);
      } catch (err) {
        setError('Error al cargar los datos del dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={`${styles.dashboardContainer} flex items-center justify-center min-h-screen`}>
        <p className="text-xl text-gray-700">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.dashboardContainer} flex items-center justify-center min-h-screen`}>
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.dashboardContainer} bg-gray-100 p-8 min-h-screen`}>
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Dashboard de RRHH</h1>

      {/* Sección de Resumen de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Vacantes Activas" value={dashboardData.totalVacantesActivas} />
        <MetricCard title="Vacantes Inactivas" value={dashboardData.totalVacantesInactivas} />
        <MetricCard title="Nuevas Postulaciones Hoy" value={dashboardData.nuevasPostulacionesHoy} />
        <MetricCard title="Postulaciones esta Semana" value={dashboardData.postulacionesEstaSemana} />
      </div>

      {/* Sección de Gráficos de Postulaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Postulaciones por Vacante</h2>
          <PlaceholderChart title="Gráfico de Barras: Postulaciones por Vacante" />
          {/* Aquí iría un componente de gráfico real, por ejemplo, un BarChart */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Postulaciones por Período</h2>
          <PlaceholderChart title="Gráfico de Líneas: Postulaciones por Período" />
          {/* Aquí iría un componente de gráfico real, por ejemplo, un LineChart */}
        </div>
      </div>

      {/* Sección de Estado de Candidatos */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Candidatos por Etapa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard title="Recibidas" value={dashboardData.candidatosPorEtapa.recibida} small />
          <MetricCard title="En Revisión" value={dashboardData.candidatosPorEtapa.enRevision} small />
          <MetricCard title="Entrevista" value={dashboardData.candidatosPorEtapa.entrevista} small />
          <MetricCard title="Contratados" value={dashboardData.candidatosPorEtapa.contratado} small />
          <MetricCard title="Rechazados" value={dashboardData.candidatosPorEtapa.rechazado} small />
        </div>
      </div>

      {/* Sección de Vacantes con Más/Menos Postulaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vacantes con Más Postulaciones</h2>
          <ul className="list-disc pl-5 text-gray-600">
            {dashboardData.vacantesMasPostulaciones.length > 0 ? (
              dashboardData.vacantesMasPostulaciones.map(vacante => (
                <li key={vacante.id}>{vacante.titulo} ({vacante.postulaciones} postulaciones)</li>
              ))
            ) : (
              <li>No hay datos disponibles.</li>
            )}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vacantes con Menos Postulaciones</h2>
          <ul className="list-disc pl-5 text-gray-600">
            {dashboardData.vacantesMenosPostulaciones.length > 0 ? (
              dashboardData.vacantesMenosPostulaciones.map(vacante => (
                <li key={vacante.id}>{vacante.titulo} ({vacante.postulaciones} postulaciones)</li>
              ))
            ) : (
              <li>No hay datos disponibles.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Sección de Resumen de Usuarios (Opcional) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Resumen de Usuarios Administradores</h2>
        <ul className="list-disc pl-5 text-gray-600">
          {dashboardData.resumenUsuarios.length > 0 ? (
            dashboardData.resumenUsuarios.map(user => (
              <li key={user.id}>{user.nombre} ({user.rol})</li>
            ))
          ) : (
            <li>No hay usuarios registrados.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
