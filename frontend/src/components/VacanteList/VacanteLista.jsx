import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importa Link para la navegación

export const VacantesList = () => { // Renombrado de VacantesAdmin a VacantesList
  const [vacantes, setVacantes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLocalhost = window.location.hostname === "localhost";
  const API_URL = isLocalhost
    ? "http://localhost:3000/api/vacantes"
    : "https://novum-app.onrender.com/api/vacantes";

  useEffect(() => {
    const fetchVacantes = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las vacantes");
        }

        const data = await response.json();
        setVacantes(data);
      } catch (err) {
        console.error("Error al obtener las vacantes:", err);
        setError(err.message || "No se pudieron cargar las vacantes.");
      } finally {
        setLoading(false);
      }
    };
    fetchVacantes();
  }, [API_URL]); // Dependencia API_URL para evitar warnings

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center font-inter">
        <p className="text-xl text-gray-700">Cargando vacantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center font-inter">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (vacantes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center font-inter">
        <p className="text-xl text-gray-700">
          No hay vacantes disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 py-8 px-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Administración de Vacantes
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacantes.map((vacante) => (
            <div
              key={vacante.id_vacante}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Título de la vacante */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {vacante.titulo} {/* Usar 'titulo' en lugar de 'titulo_cargo' */}
              </h2>

              {/* Descripción corta */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {vacante.descripcion} {/* Usar 'descripcion' en lugar de 'descripcion_corta' */}
              </p>

              {/* Información adicional */}
              <div className="text-gray-700 text-sm mb-4 space-y-1">
                <p>
                  <strong>Postulaciones:</strong>{" "}
                  <span className="font-medium text-blue-700">
                    {vacante.num_postulaciones || 0}
                  </span>
                </p>
                <p>
                  <strong>Publicada:</strong>{" "}
                  <span className="font-medium">
                    {new Date(vacante.fecha_publicacion).toLocaleDateString()}
                  </span>
                </p>
              </div>

              {/* Botón para ver detalles y postulaciones */}
              <div className="text-right">
                <Link
                  to={`/vacantes/${vacante.id_vacante}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Ver Postulaciones
                  {/* Icono de flecha o similar si lo deseas */}
                  <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path><path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
