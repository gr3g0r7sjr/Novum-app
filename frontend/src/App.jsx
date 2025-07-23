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
import { VacanteDetalle } from './components/VacanteDetalle/VacanteDetalle.jsx';
import ApplyVacantes from './components/ApplyVacantes/ApplyVacantes';

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
          <Route path='/login' element={
            <Layout>
              <LoginAdmin />
            </Layout>
            } />


          {/*Rutas para las vacantes*/}
          <Route path="/vacantes/:id" element={
            <Layout>
              <VacanteDetalle />
            </Layout>
          } />


          {/* Rutas de administración */}
          <Route path='/admin/dashboard' element={
            <Layout>
              <AdminDashboard/>
            </Layout>
            } />
          <Route path='/admin/vacantes' element={
            <Layout>
              <VacantesAdmin/> 
            </Layout>
            } />
          {/* Ruta para el formulario de creación de vacantes */}
          <Route path='/admin/crearVacante' element={
            <Layout>
              <CrearVacantePage />
            </Layout>
            } /> 
          <Route path='/admin/candidatos' element={
            <Layout>
              <AdminDashboard/>
            </Layout>
            } />
          {/* Nueva ruta para el formulario de postulación de candidatos          */}
          {/* El :idVacante en la URL permite capturar el ID de la vacante        */}
          {/* a la que el candidato se está postulando.                           */}
          {/* =================================================================== */}
          <Route path="/vacantes/:idVacante/postular" element={
            <Layout>
              <ApplyVacantes/>
            </Layout>
            } />  
          {/* Ruta 404 para cualquier otra ruta no definida */}
          <Route path="*" element={<h1>404 - Página No Encontrada</h1>} />
        </Routes>
        
    </>
  )
}

export default App;