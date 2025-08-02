import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Dashboard.module.scss';
import MetricCard from '../../components/Dashboard/MetricCard';

// Importa los componentes de Recharts
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

// Define la URL base de tu backend.
const API_BASE_URL = 'http://localhost:3000/api'; 

const Dashboard = () => {
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
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('jwt_token'); // Usar 'jwt_token' como clave

        if (!token) {
          setError('No hay token de autenticación. Por favor, inicie sesión.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/dashboard/metrics`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Asegúrate de que los datos de la API coincidan con la estructura esperada
        // El backend ya debería devolver los datos en un formato cercano al necesario
        setDashboardData(response.data);

      } catch (err) {
        console.error('Error al cargar los datos del dashboard:', err);
        if (err.response && err.response.status === 401) {
          setError('Sesión expirada o no autorizada. Por favor, inicie sesión nuevamente.');
        } else {
          setError('Error al cargar los datos del dashboard. Intente de nuevo más tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- Preparación de datos para los gráficos ---
  // Datos para el gráfico de barras (Postulaciones por Vacante)
  // Usaremos las vacantes con más postulaciones
  const postulacionesPorVacanteChartData = dashboardData.vacantesMasPostulaciones.map(item => ({
    name: item.titulo, // Nombre de la vacante para el eje X
    Postulaciones: item.postulaciones // Valor para la barra
  }));

  // Datos para el gráfico de líneas (Postulaciones por Período)
  // Como el backend no devuelve datos diarios/semanales agregados, simularemos algunos para la demostración.
  // En un escenario real, necesitarías una consulta SQL en el backend que agregue postulaciones por día/semana.
  const postulacionesPorPeriodoChartData = [
    { name: 'Día 1', Postulaciones: 5 },
    { name: 'Día 2', Postulaciones: 12 },
    { name: 'Día 3', Postulaciones: 8 },
    { name: 'Día 4', Postulaciones: 15 },
    { name: 'Día 5', Postulaciones: 10 },
    { name: 'Día 6', Postulaciones: 20 },
    { name: 'Día 7', Postulaciones: dashboardData.nuevasPostulacionesHoy }, // Usamos el dato real de hoy
  ];


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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={postulacionesPorVacanteChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Postulaciones" fill="#3b82f6" /> {/* Azul de Tailwind */}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Postulaciones por Período</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={postulacionesPorPeriodoChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Postulaciones" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
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
              <li key={user.rol}>{user.rol}: {user.count}</li> 
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
