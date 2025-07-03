// frontend/src/App.jsx
import './styles/App.css'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavHeader } from './components/NavHeader.jsx'; // Asegúrate de que esta ruta sea correcta
import { Home } from './pages/Home.jsx'; // Mantener Home por si la usas en otra ruta
import { About } from './pages/About.jsx';
import { Contact } from './pages/Contact.jsx';
import { LoginAdmin } from './components/Auth/LoginAdmin.jsx'

// Importamos la nueva página de Vacantes
import VacantesPage from './pages/VacantesPage.jsx';

// Definición de diferentes GRUPOS de rutas de navegación
const navRouteGroups = {
  main: [ // Rutas para la navegación principal (no admin)
    { path: '/', name: 'Vacantes' }, // El path '/' ahora apunta a Vacantes
    { path: '/nosotros', name: 'Nosotros' },
    { path: '/contacto', name: 'Contacto' },
    { path: '/login', name: 'Login'}
  ]
};

function App() {
  return (
    <>
      <NavHeader routesGroups={navRouteGroups} />
      <section>
        <Routes>
          {/* Ruta principal ahora para las vacantes */}
          <Route path="/" element={<VacantesPage />} /> 
          {/* Si quieres mantener la Home original en otra ruta, por ejemplo /home */}
          <Route path="/home-original" element={<Home />} /> 
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path='/login' element={<LoginAdmin />} />
          <Route path="*" element={<h1>404 - Página No Encontrada</h1>} />
        </Routes>
      </section>
    </>
  )
}

export default App;