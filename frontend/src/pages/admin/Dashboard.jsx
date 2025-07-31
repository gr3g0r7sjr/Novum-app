import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa Axios para hacer peticiones HTTP
import styles from '../../styles/Dashboard.module.scss'; // Importa los estilos SCSS
import MetricCard from '../../components/Dashboard/MetricCard'; // Importa el componente de tarjeta de métrica

// Importa los componentes de Recharts
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

// Define la URL base de tu backend.
// ¡IMPORTANTE! Asegúrate de que este puerto coincida con el puerto donde tu backend está corriendo.
// Según tu index.js, tu backend probablemente está en el puerto 3000.
const API_BASE_URL = 'http://localhost:3000/api'; 

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
    postulacionesPorPeriodo: [] // <-- AÑADIDO: Nuevo estado para los datos del gráfico de línea
  });

  const [loading, setLoading] = useState(true); // Estado para controlar la carga de datos
  const [error, setError] = useState(null); // Estado para controlar errores en la carga

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true); // Inicia el estado de carga
        setError(null); // Limpia cualquier error previo

        // Obtener el token de autenticación desde el localStorage.
        // ¡CORRECCIÓN! Usar 'jwt_token' en lugar de 'token'
        const token = localStorage.getItem('jwt_token'); 

        // Si no hay token, muestra un error y detiene la ejecución
        if (!token) {
          setError('No hay token de autenticación. Por favor, inicie sesión.');
          setLoading(false);
          // Opcional: Podrías redirigir al usuario a la página de login si no hay token
          // import { useNavigate } from 'react-router-dom';
          // const navigate = useNavigate();
          // navigate('/admin/login');
          return;
        }

        // Realizar la llamada a la API del backend usando Axios
        const response = await axios.get(`${API_BASE_URL}/dashboard/metrics`, {
          headers: {
            Authorization: `Bearer ${token}` // Incluye el token JWT en el header de autorización
          }
        });

        // Actualizar el estado del dashboard con los datos reales obtenidos de la API
        setDashboardData(response.data);

      } catch (err) {
        // Manejo de errores en caso de que la petición falle
        console.error('Error al cargar los datos del dashboard:', err);
        if (err.response && err.response.status === 401) {
          // Si el error es 401 (Unauthorized), el token es inválido o expiró
          setError('Sesión expirada o no autorizada. Por favor, inicie sesión nuevamente.');
          // Opcional: Limpiar el token y redirigir a login
          // localStorage.removeItem('jwt_token'); // Limpiar el token con la clave correcta
          // navigate('/admin/login');
        } else {
          // Otros tipos de errores de red o servidor
          setError('Error al cargar los datos del dashboard. Intente de nuevo más tarde.');
        }
      } finally {
        setLoading(false); // Finaliza el estado de carga, independientemente del resultado
      }
    };

    fetchDashboardData(); // Llama a la función para obtener los datos cuando el componente se monta
  }, []); // El array de dependencias vacío asegura que este efecto se ejecute solo una vez al montar

  // Renderizado condicional basado en el estado de carga y error
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

  // Renderizado del dashboard con los datos obtenidos
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
              data={dashboardData.vacantesMasPostulaciones} // Usa los datos reales del backend
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="titulo" angle={-15} textAnchor="end" height={50} /> {/* dataKey es 'titulo' */}
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="postulaciones" fill="#3b82f6" /> {/* dataKey es 'postulaciones' */}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Postulaciones por Período</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dashboardData.postulacionesPorPeriodo} // Usa los datos reales del backend
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
          {/* Asegúrate de que los nombres de las propiedades coincidan con lo que devuelve tu backend */}
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
