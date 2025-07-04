// frontend/src/App.jsx
import './styles/App.css'
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Asegúrate de importar Link
import { NavHeader } from './components/NavHeader.jsx';
import { Home } from './pages/Home.jsx';
import { About } from './pages/About.jsx'; // <--- ¡Aquí está la corrección!
import { Contact } from './pages/Contact.jsx';
import { LoginAdmin } from './components/Auth/LoginAdmin.jsx';
import VacantesPage from './pages/VacantesPage.jsx';

// Importa el nuevo componente del formulario
import CrearVacantePage from './pages/CrearVacantePage.jsx'; 


// Definición de diferentes GRUPOS de rutas de navegación
const navRouteGroups = {
  main: [ // Rutas para la navegación principal (no admin)
    { path: '/', name: 'Vacantes' },
    { path: '/crear-vacante', name: 'Crear Vacante' }, // Nueva ruta para el formulario
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
          <Route path="/" element={<VacantesPage />} /> 
          <Route path="/home-original" element={<Home />} /> 
          {/* Nueva ruta para el formulario de crear vacante */}
          <Route path="/crear-vacante" element={<CrearVacantePage />} />
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