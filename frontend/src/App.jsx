import './styles/App.css'
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { NavHeader } from './components/NavHeader.jsx';
import { About } from './pages/About.jsx';
import { Contact } from './pages/Contact.jsx';
import { LoginAdmin } from './components/Auth/LoginAdmin.jsx';
import { AdminDashboard } from './pages/Admin.jsx';
import { Footer } from './components/Footer/Footer.jsx';
import { VacantesPage } from './pages/VacantesPage.jsx';
import {Layout} from './layouts/Layout.jsx'

// Importa los nuevos componentes de página
import {CrearVacantePage} from './pages/CrearVacantePage.jsx';
import { VacantesAdmin } from './pages/VacantesAdmin.jsx';


function App() {
  return (
    <>
      
        <Routes>
          {/* Ruta principal para las vacantes públicas */}
          <Route path="/" element={ 
            <Layout>
              <VacantesPage />
            </Layout>} /> 

          {/* Rutas públicas adicionales */}
          <Route path="/nosotros" element={
            <Layout>
              <About />
            </Layout>
            } />
          <Route path="/contacto" element={
            <Layout>
              <Contact />
            </Layout>
            } />
          <Route path='/login' element={<LoginAdmin />} />

          {/* Rutas de administración */}
          <Route path='/admin/dashboard' element={<AdminDashboard/>} />
          <Route path='/admin/vacantes' element={<VacantesAdmin/>} />
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