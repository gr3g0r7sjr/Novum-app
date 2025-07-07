// frontend/src/App.jsx
import './styles/App.css'
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Asegúrate de importar Link
import { NavHeader } from './components/NavHeader.jsx';
import { Home } from './pages/Home.jsx';
import { About } from './pages/About.jsx'; // <--- ¡Aquí está la corrección!
import { Contact } from './pages/Contact.jsx';
import { LoginAdmin } from './components/Auth/LoginAdmin.jsx';
import { AdminDashboard } from './pages/Admin.jsx';

// Definición de diferentes GRUPOS de rutas de navegación
const navRouteGroups = {
  main: [ // Rutas para la navegación principal (no admin)
    { path: '/', name: 'Vacantes' },
    { path: '/nosotros', name: 'Nosotros' },
    { path: '/contacto', name: 'Contacto' },
    { path: '/login', name: 'Login'}
  ],
  admin: [
    {path: '/admin/dashboard', name : 'Dashboard'},
    {path: '/admin/curriculus', name:'Curriculus'},
    {path: '/admin/crearVacante', name: 'Crear Vacante'},
    {path: '/admin/candidatos', name:'Candidatos'},
  ]
};


function App() {
  return (
    <>
      <NavHeader routesGroups={navRouteGroups} />
      <section>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path='/login' element={<LoginAdmin />} />
          <Route path='/admin/dashboard' element={<AdminDashboard/>} />
          <Route path='/admin/curriculus' element={<AdminDashboard/>} />
          <Route path='/admin/crearVacante' element={<AdminDashboard/>} />
          <Route path='/admin/candidatos' element={<AdminDashboard/>} />
          <Route path="*" element={<h1>404 - Página No Encontrada</h1>} />
        </Routes>
      </section>
    </>
  )
}

export default App;