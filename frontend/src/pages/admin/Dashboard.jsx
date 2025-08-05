// frontend/src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // <-- Eliminamos la importación de Axios
import styles from '../../styles/Dashboard.module.scss'; // Importa los estilos SCSS
import MetricCard from '../../components/Dashboard/MetricCard'; // Importa el componente de tarjeta de métrica

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
    postulacionesPorPeriodo: [] // Nuevo estado para los datos del gráfico de línea
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener el token de autenticación desde el localStorage.
        const token = localStorage.getItem('jwt_token'); 

        if (!token) {
          setError('No hay token de autenticación. Por favor, inicie sesión.');
          setLoading(false);
          return;
        }

        // Realizar la llamada a la API del backend usando Fetch
        const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
          method: 'GET', // Método HTTP
          headers: {
            'Content-Type': 'application/json', // Tipo de contenido que se envía (aunque para GET no es tan crítico)
            Authorization: `Bearer ${token}` // Incluye el token JWT en el header de autorización
          }
        });

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
          // Si la respuesta no es OK (ej. 401, 500), lanzar un error
          const errorData = await response.json(); // Intentar parsear el cuerpo del error
          if (response.status === 401) {
            throw new Error('Sesión expirada o no autorizada. Por favor, inicie sesión nuevamente.');
          } else {
            throw new Error(errorData.message || 'Error al cargar los datos del dashboard.');
          }
        }

        // Parsear la respuesta JSON
        const data = await response.json();

        // Actualizar el estado del dashboard con los datos reales obtenidos de la API
        setDashboardData(data);

      } catch (err) {
        console.error('Error al cargar los datos del dashboard:', err);
        setError(err.message || 'Error al cargar los datos del dashboard. Intente de nuevo más tarde.');
        // Opcional: Limpiar el token y redirigir a login si es un 401
        // if (err.message.includes('no autorizada')) {
        //   localStorage.removeItem('jwt_token');
        //   navigate('/admin/login');
        // }
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
