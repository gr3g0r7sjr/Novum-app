import './styles/App.css'
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { NavHeader } from './components/NavHeader.jsx';
import { Home } from './pages/Home.jsx'; // Mantén Home si la usas en otra ruta o como fallback
import { About } from './pages/About.jsx';
import { Contact } from './pages/Contact.jsx';
import { LoginAdmin } from './components/Auth/LoginAdmin.jsx';
import { AdminDashboard } from './pages/Admin.jsx'; // Asume que existe

// Importa los nuevos componentes de página
import VacantesPage from './pages/VacantesPage.jsx';
import CrearVacantePage from './pages/CrearVacantePage.jsx';

// Definición de diferentes GRUPOS de rutas de navegación
const navRouteGroups = {
  main: [ // Rutas para la navegación principal (público)
    { path: '/', name: 'Vacantes' }, // La ruta principal ahora muestra las vacantes
    { path: '/nosotros', name: 'Nosotros' },
    { path: '/contacto', name: 'Contacto' },
    { path: '/login', name: 'Login'} // Login para administradores
  ],
  admin: [ // Rutas para el panel de administración
    {path: '/admin/dashboard', name : 'Dashboard'},
    {path: '/admin/curriculus', name:'Curriculus'},
    {path: '/admin/crearVacante', name: 'Crear Vacante'}, // Enlace al formulario de creación
    {path: '/admin/candidatos', name:'Candidatos'},
  ]
};


function App() {
  return (
    <>
      <NavHeader routesGroups={navRouteGroups} />
        <Routes>
          {/* Ruta principal para las vacantes públicas */}
          <Route path="/" element={<VacantesPage />} /> 

          {/* Rutas públicas adicionales */}
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path='/login' element={<LoginAdmin />} />

          {/* Rutas de administración */}
          <Route path='/admin/dashboard' element={<AdminDashboard/>} />
          <Route path='/admin/curriculus' element={<AdminDashboard/>} />
          {/* Ruta para el formulario de creación de vacantes */}
          <Route path='/admin/crearVacante' element={<CrearVacantePage />} /> 
          <Route path='/admin/candidatos' element={<AdminDashboard/>} />

          {/* Ruta 404 para cualquier otra ruta no definida */}
          <Route path="*" element={<h1>404 - Página No Encontrada</h1>} />
        </Routes>
    </>
  )
}

export default App;