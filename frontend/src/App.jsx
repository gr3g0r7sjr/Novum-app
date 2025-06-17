import './styles/App.css'
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import { NavHeader } from './components/NavHeader.jsx'; // Asegúrate de la ruta
import { Home } from './pages/Home.jsx';
import { About } from './pages/About.jsx';
import { Contact } from './pages/Contact.jsx';
import {LoginForm} from './components/Auth/LoginForm.jsx' // ¡Asumiendo que tienes una página de administración!

// Definición de diferentes GRUPOS de rutas de navegación
const navRouteGroups = {
  main: [ // Rutas para la navegación principal (no admin)
    { path: '/', name: 'Vacantes' },
    { path: '/nosotros', name: 'Nosotros' },
    { path: '/contacto', name: 'Contacto' },
    { path: '/login', name: 'Login'}
  ],
  admin: [ // Rutas para el panel de administración
    { path: '/admin', name: 'Dashboard Admin' },
    { path: '/admin/users', name: 'Gestionar Usuarios' },
    { path: '/admin/settings', name: 'Configuración' },
  ],
};
  // Puedes añadir más grupos según tu necesidad, ej: 'loggedInUser', 'guestUser'

function App() {
  return (
      <>
        <NavHeader routesGroups={navRouteGroups} />
        <section>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
            {/* Ruta para el área de administración. El '/*' permite rutas anidadas. */}
            {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}
            <Route path='/login' element={<LoginForm />} />
            <Route path="*" element={<h1>404 - Página No Encontrada</h1>} />
          </Routes>
        </section>
      </>
  )
}

export default App;
