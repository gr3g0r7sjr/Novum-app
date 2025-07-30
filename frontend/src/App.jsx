import "./styles/App.css";
import { Routes, Route, Link } from "react-router-dom";
import { About } from "./pages/About.jsx";
import { Contact } from "./pages/Contact.jsx";
import { LoginAdmin } from "./components/Auth/LoginAdmin.jsx";
import { AdminDashboard } from "./pages/Admin.jsx";
import { VacantesPage } from "./pages/VacantesPage.jsx";
import { Layout } from "./layouts/Layout.jsx";
import { CrearUsuario } from "./components/CrearUsuario/CrearUsuario.jsx";
import { EditarVacantePage } from "./components/EditarVacante/EditarVacante.jsx";
import { VacanteDetalle } from "./components/VacanteDetalle/VacanteDetalle.jsx";
import ApplyVacantes from "./components/ApplyVacantes/ApplyVacantes";
import {CandidatosSeleccionados} from "./components/CandidatosSelec/CandidatosSeleccion.jsx"

import { CrearVacantePage } from "./pages/CrearVacantePage.jsx";
import { VacantesAdmin } from "./pages/VacantesAdmin.jsx";

function App() {
  return (
    <>
      <Routes>
        {/* Ruta principal para las vacantes públicas */}
        <Route
          path="/"
          element={
            <Layout>
              <VacantesPage />
            </Layout>
          }
        />

        {/* Rutas públicas adicionales */}
        <Route
          path="/nosotros"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/contacto"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginAdmin />
            </Layout>
          }
        />

        {/*Rutas para las vacantes*/}
        <Route
          path="/vacantes/:id"
          element={
            <Layout>
              <VacanteDetalle />
            </Layout>
          }
        />
        <Route
          path="/vacantes/:idVacante/postulaciones"
          element={
            <Layout>
              <ApplyVacantes />
            </Layout>
          }
        />

        {/* Rutas de administración PRIVADAS */}
        <Route
          path="/admin/dashboard"
          element={
            <Layout>
              <AdminDashboard />
            </Layout>
          }
        />
        <Route
          path="/admin/vacantes"
          element={
            <Layout>
              <VacantesAdmin />
            </Layout>
          }
        />
        {/* Ruta para el formulario de creación de vacantes */}
        <Route
          path="/admin/crearVacante"
          element={
            <Layout>
              <CrearVacantePage />
            </Layout>
          }
        />
        <Route
          path="/admin/candidatos"
          element={
            <Layout>
              <CandidatosSeleccionados />
            </Layout>
          }
        />
        <Route
          path="/admin/crear-usuario"
          element={
            <Layout>
              <CrearUsuario />
            </Layout>
          }
        />
        <Route path="/admin/vacantes/editar/:id" element={
          <Layout>
            <EditarVacantePage />
          </Layout>
        } />

        {/* Ruta 404 para cualquier otra ruta no definida */}
        <Route path="*" element={<h1>404 - Página No Encontrada</h1>} />
      </Routes>
    </>
  );
}

export default App;
