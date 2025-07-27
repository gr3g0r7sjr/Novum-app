import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const VacantesAdmin = () => {
  const [vacantes, setVacantes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLocalhost = window.location.hostname === "localhost";
  const API_URL = isLocalhost
    ? "http://localhost:3000/api/vacantes"
    : "https://novum-app.onrender.com/api/vacantes";
  const POSTULACIONES_API_URL = isLocalhost
    ? "http://localhost:3000/api/postulaciones/total_postulaciones"
    : "https://novum-app.onrender.com/api/postulaciones/conteo-por-vacante";

  // Esta función refrescará los datos del estado
  const refreshData = async () => {
    setLoading(true);
    try {
      const vacantesResponse = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!vacantesResponse.ok) {
        throw new Error("Error al obtener las vacantes");
      }

      const vacantesData = await vacantesResponse.json();

      const postulacionesResponse = await fetch(POSTULACIONES_API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!postulacionesResponse.ok) {
        throw new Error("Error al obtener el conteo de postulaciones");
      }

      const postulacionesData = await postulacionesResponse.json();

      const conteoMap = new Map();
      postulacionesData.forEach((item) => {
        conteoMap.set(item.id_vacante, item.total_postulaciones);
      });

      const vacantesConConteo = vacantesData.map((vacante) => ({
        ...vacante,
        total_postulaciones: conteoMap.get(vacante.id_vacante) || 0,
      }));

      setVacantes(vacantesConConteo);
    } catch (err) {
      console.error("Error al obtener datos:", err);
      setError(err.message || "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [API_URL, POSTULACIONES_API_URL]);

  const handleDelete = async (id_vacante) => {
    // Confirmación antes de borrar
    if (window.confirm("¿Estás seguro de que quieres eliminar esta vacante?")) {
      try {
        const deleteResponse = await fetch(`${API_URL}/${id_vacante}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          
        });

        if (!deleteResponse.ok) {
          throw new Error("Error al eliminar la vacante");
        }

        // Si la eliminación es exitosa, actualizamos el estado
        await refreshData();
        alert("Vacante eliminada exitosamente.");
      } catch (err) {
        console.error("Error al eliminar la vacante:", err);
        setError(err.message || "No se pudo eliminar la vacante.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center font-inter">
        <p className="text-xl text-gray-700">Cargando vacantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center font-inter">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (vacantes.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center font-inter">
        <p className="text-xl text-gray-700">
          No hay vacantes disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <section
      className="min-h-screen py-8 px-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
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
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {vacante.titulo_cargo}
              </h2>
              <p className="text-gray-700 mb-2">
                <strong>Área:</strong> {vacante.area}
              </p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {vacante.descripcion_corta}
              </p>
              <div className="text-gray-700 text-sm mb-4 space-y-1">
                <p>
                  <strong>Postulaciones:</strong>{" "}
                  <span className="font-medium text-blue-700">
                    {vacante.total_postulaciones}
                  </span>
                </p>
                <p>
                  <strong>Publicada:</strong>{" "}
                  <span className="font-medium">
                    {new Date(vacante.fecha_publicacion).toLocaleDateString()}
                  </span>
                </p>
              </div>

              {/* Contenedor para los nuevos botones */}
              <div className="flex justify-end space-x-4">
                {/* Botón para Eliminar */}
                <button
                  onClick={() => handleDelete(vacante.id_vacante)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Eliminar
                </button>

                {/* Botón para Editar (usando Link) */}
                <Link
                  to={`/admin/vacantes/editar/${vacante.id_vacante}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Editar Vacante
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
