import React, { useEffect, useState } from "react";

export const VacantesAdmin = () => {
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Cargando vacantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (vacantes.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-xl text-gray-700">
          No hay vacantes disponibles en este momento.
        </p>
      </div>
    );
  }
  return (
    <section>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Vacantes Disponibles
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacantes.map((vacante) => (
            <div
              key={vacante.id_vacante}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-2">
                {vacante.titulo_cargo}
              </h2>
              <p className="text-gray-700 mb-2">
                <strong>Área:</strong> {vacante.area}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {vacante.descripcion_corta}
              </p>
              <div className="text-right">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
