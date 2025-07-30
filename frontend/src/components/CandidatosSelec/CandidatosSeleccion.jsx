import React, { useState, useEffect } from "react";

export const CandidatosSeleccionados = () => {
  const [vacantes, setVacantes] = useState([]); // Para la lista de vacantes en el dropdown
  const [selectedVacanteId, setSelectedVacanteId] = useState(""); // ID de la vacante seleccionada
  const [candidatos, setCandidatos] = useState([]); // Lista de candidatos (filtrados o todos)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:3000/api"
    : "https://novum-app.onrender.com/api";

  useEffect(() => {
    const fetchVacantes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/vacantes`);
        if (!response.ok) {
          throw new Error("Failed to fetch vacantes.");
        }
        const data = await response.json();
        setVacantes(data);
      } catch (err) {
        console.error("Error fetching vacantes:", err);
        setError("Failed to load vacantes for dropdown.");
      }
    };

    fetchVacantes();
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchCandidatos = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}/candidatos`;
        if (selectedVacanteId) {
          url = `${API_BASE_URL}/candidatos/por-vacante-con-match?id_vacante=${selectedVacanteId}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch candidates: ${response.statusText}`);
        }
        const data = await response.json();
        setCandidatos(data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatos();
  }, [selectedVacanteId, API_BASE_URL]);

  const handleVacanteChange = (e) => {
    setSelectedVacanteId(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-inter">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Dashboard de Candidatos y Postulaciones
        </h1>

        {/* Vacante Filter */}
        <div className="mb-6">
          <label
            htmlFor="vacante-select"
            className="block text-gray-700 text-lg font-semibold mb-2"
          >
            Filtrar por Vacante:
          </label>
          <select
            id="vacante-select"
            value={selectedVacanteId}
            onChange={handleVacanteChange}
            className="block w-full md:w-1/2 lg:w-1/3 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          >
            <option value="">
              Todas las Vacantes (Mostrar todos los candidatos)
            </option>
            {vacantes.map((vacante) => (
              <option key={vacante.id_vacante} value={vacante.id_vacante}>
                {vacante.titulo_cargo} ({vacante.nombre_servicio_interes}){" "}
              </option>
            ))}
          </select>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center text-blue-600 text-lg">
            Cargando candidatos...
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 text-lg">Error: {error}</div>
        )}

        {/* Candidates List */}
        {!loading && !error && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedVacanteId
                ? `Candidatos para "${vacantes.find((v) => v.id_vacante == selectedVacanteId)?.titulo || "Vacante Desconocida"}"`
                : "Todos los Candidatos"}{" "}
              ({candidatos.length})
            </h2>

            {candidatos.length === 0 ? (
              <p className="text-gray-600 text-center">
                {selectedVacanteId
                  ? "No hay postulaciones para esta vacante."
                  : "No hay candidatos registrados."}
              </p>
            ) : (
              <div className="space-y-6">
                {candidatos.map((candidato) => (
                  <div
                    key={candidato.id_candidato || candidato.id_postulacion} // Use id_candidato if available, else id_postulacion
                    className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {candidato.candidato_nombre || candidato.nombre}{" "}
                        {candidato.candidato_apellido || candidato.apellido}
                      </h3>
                      {selectedVacanteId &&
                        candidato.match_score !== undefined && (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold
                          ${
                            candidato.match_score >= 80
                              ? "bg-green-100 text-green-800"
                              : candidato.match_score >= 50
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                          >
                            Match: {candidato.match_score}%
                          </span>
                        )}
                    </div>

                    <p className="text-gray-600 text-sm">
                      Correo: {candidato.correo_electronico}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Teléfono: {candidato.numero_telefono || "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      Identificación: {candidato.tipo_identificacion}-
                      {candidato.cedula}
                    </p>

                    {/* Display Vacante Title if filtered */}
                    {selectedVacanteId && candidato.vacante_titulo && (
                      <p className="text-gray-700 text-base font-medium mb-3">
                        Postulado a:{" "}
                        <span className="text-blue-700">
                          {candidato.vacante_titulo}
                        </span>
                      </p>
                    )}

                    {/* Detalles de Educación */}
                    {candidato.educacion && candidato.educacion.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 text-md mb-1">
                          Educación:
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                          {candidato.educacion.map((edu, idx) => (
                            <li key={idx}>
                              {edu.titulo} en {edu.institucion} (
                              {edu.fechaInicio} - {edu.fechaFin})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Detalles de Experiencia Laboral */}
                    {candidato.experiencia_laboral &&
                      candidato.experiencia_laboral.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-700 text-md mb-1">
                            Experiencia Laboral:
                          </h4>
                          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                            {candidato.experiencia_laboral.map((exp, idx) => (
                              <li key={idx}>
                                {exp.puesto} en {exp.empresa} ({exp.fechaInicio}{" "}
                                - {exp.fechaFin})
                                {exp.descripcion &&
                                  ` - ${exp.descripcion.substring(0, 70)}...`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Detalles de Cursos y Certificaciones */}
                    {candidato.cursos_certificaciones &&
                      candidato.cursos_certificaciones.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-700 text-md mb-1">
                            Cursos y Certificaciones:
                          </h4>
                          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                            {candidato.cursos_certificaciones.map(
                              (cert, idx) => (
                                <li key={idx}>
                                  {cert.nombre} de {cert.institucion} (Obtenido:{" "}
                                  {cert.fechaObtencion})
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Detalles de Habilidades */}
                    {candidato.habilidades &&
                      candidato.habilidades.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-700 text-md mb-1">
                            Habilidades:
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {candidato.habilidades.map((hab, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                              >
                                {hab}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatosSeleccionados;
