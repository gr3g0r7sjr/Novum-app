import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ApplyVacantes.module.scss"; // Importa los módulos SCSS

const ApplyVacantes = () => {
  const { idVacante } = useParams(); // idVacante es el ID de la vacante a la que se aplica
  const navigate = useNavigate();

  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:3000/api"
    : "https://novum-app.onrender.com/api";

  // Estado para los datos del formulario del candidato
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo_electronico: "",
    numero_telefono: "",
    direccion: "",
    educacion: "", // Se convertirá a array
    experiencia_laboral: "", // Se convertirá a array
    cursos_certificaciones: "", // Se convertirá a array
    habilidades: "", // Se convertirá a array
    servicio_interes: "", // Este será el ID del interés, se convertirá a número
    vehiculo: "", // 's¡' o 'no', se inicializa vacío
    fecha_expiracion_datos: "",
  });

  // Estado para la lista de intereses de la empresa (para el select)
  const [interesesEmpresa, setInteresesEmpresa] = useState([]);
  const [loading, setLoading] = useState(true); // Para la carga inicial de intereses
  const [submitting, setSubmitting] = useState(false); // Para el envío del formulario
  const [error, setError] = useState(null); // Para errores de carga de intereses
  const [submissionError, setSubmissionError] = useState(null); // Para errores de envío
  const [successMessage, setSuccessMessage] = useState(null); // Para mensajes de éxito

  // Cargar los servicios de interés al montar el componente
  useEffect(() => {
    const fetchIntereses = async () => {
      try {
        // La ruta para obtener servicios de interés es /api/vacantes/servicios-interes
        const response = await fetch(
          `${API_BASE_URL}/vacantes/servicios-interes`,
        );
        if (!response.ok) {
          throw new Error("No se pudieron cargar los intereses de la empresa");
        }
        const data = await response.json();
        setInteresesEmpresa(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIntereses();
  }, [API_BASE_URL]); // Dependencia API_BASE_URL para evitar warnings

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionError(null);
    setSuccessMessage(null);

    // --- 1. Transformar campos de texto a arrays ---
    // Usamos split('\n') si el usuario ingresa elementos en nuevas líneas
    // O split(',') si los separa por comas (ajusta según tu UX deseada)
    const processedFormData = {
      ...formData,
      educacion: formData.educacion
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      experiencia_laboral: formData.experiencia_laboral
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      cursos_certificaciones: formData.cursos_certificaciones
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      habilidades: formData.habilidades
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      // --- 2. Convertir servicio_interes a número ---
      servicio_interes: formData.servicio_interes
        ? parseInt(formData.servicio_interes, 10)
        : null,
      // Asegúrate que vehiculo sea 's¡' o 'no', o null si no se selecciona
      vehiculo: formData.vehiculo || null,
      // Convertir fecha_expiracion_datos a formato de fecha si es necesario para el backend
      fecha_expiracion_datos: formData.fecha_expiracion_datos || null,
    };

    // --- 3. Preparar el cuerpo de la petición ---
    // El backend espera todos los campos del candidato y id_vacante en el mismo nivel
    const dataToSend = {
      id_vacante: parseInt(idVacante, 10), // Asegúrate de que idVacante sea un número
      ...processedFormData, // Incluye todos los datos del formulario procesados
    };

    console.log("Datos del Candidato a enviar:", dataToSend);

    try {

      const response = await fetch(`${API_BASE_URL}/vacantes/${idVacante}/postulaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Intenta leer el error del backend
        throw new Error(errorData.message || "Error al enviar la postulación");
      }

      setSuccessMessage("¡Postulación enviada con éxito!");

      // Opcional: Limpiar el formulario después de una postulación exitosa
      setFormData({
        nombre: "",
        apellido: "",
        correo_electronico: "",
        numero_telefono: "",
        direccion: "",
        educacion: "",
        experiencia_laboral: "",
        cursos_certificaciones: "",
        habilidades: "",
        servicio_interes: "",
        vehiculo: "",
        fecha_expiracion_datos: "",
      });

      // Redirigir después de un breve retraso para que el usuario vea el mensaje de éxito
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Error al postular:", err);
      setSubmissionError(`Error al enviar la postulación: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className={styles.container}>Cargando intereses...</div>;
  if (error)
    return (
      <div className={styles.container}>Error al cargar intereses: {error}</div>
    );

  return (
    <div
      className={`${styles.container} min-h-screen bg-gray-100 flex flex-col items-center justify-center`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Postúlate a la Vacante {idVacante ? `(#${idVacante})` : ""}
        </h1>

        {/* Mensajes de estado */}
        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {successMessage}
          </div>
        )}
        {submissionError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {submissionError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección de Datos Personales */}
          <fieldset className="border border-gray-300 p-6 rounded-md">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2">
              Datos Personales
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="apellido"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="correo_electronico"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="correo_electronico"
                  name="correo_electronico"
                  value={formData.correo_electronico}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="numero_telefono"
                  className="block text-sm font-medium text-gray-700"
                >
                  Número de Teléfono(04129722981)
                </label>
                <input
                  type="text"
                  id="numero_telefono"
                  name="numero_telefono"
                  value={formData.numero_telefono}
                  onChange={handleChange}
                  maxLength={11}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="direccion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dirección
                </label>
                <textarea
                  id="direccion"
                  name="direccion"
                  rows="3"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
          </fieldset>

          {/* Sección de Educación y Experiencia */}
          <fieldset className="border border-gray-300 p-6 rounded-md">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2">
              Educación y Experiencia
            </legend>
            <div>
              <label
                htmlFor="educacion"
                className="block text-sm font-medium text-gray-700"
              >
                Educación (cada entrada en una nueva línea)
              </label>
              <textarea
                id="educacion"
                name="educacion"
                rows="4"
                value={formData.educacion}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
            <div className="mt-4">
              <label
                htmlFor="experiencia_laboral"
                className="block text-sm font-medium text-gray-700"
              >
                Experiencia Laboral (cada entrada en una nueva línea)
              </label>
              <textarea
                id="experiencia_laboral"
                name="experiencia_laboral"
                rows="6"
                value={formData.experiencia_laboral}
                required
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
            <div className="mt-4">
              <label
                htmlFor="cursos_certificaciones"
                className="block text-sm font-medium text-gray-700"
              >
                Cursos y Certificaciones (cada entrada en una nueva línea)
              </label>
              <textarea
                id="cursos_certificaciones"
                name="cursos_certificaciones"
                rows="4"
                value={formData.cursos_certificaciones}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
            <div className="mt-4">
              <label
                htmlFor="habilidades"
                className="block text-sm font-medium text-gray-700"
              >
                Habilidades (cada entrada en una nueva línea)
              </label>
              <textarea
                id="habilidades"
                name="habilidades"
                rows="3"
                value={formData.habilidades}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </fieldset>

          {/* Sección de Preferencias y Otros Datos */}
          <fieldset className="border border-gray-300 p-6 rounded-md">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2">
              Preferencias y Otros
            </legend>
            <div>
              <label
                htmlFor="servicio_interes"
                className="block text-sm font-medium text-gray-700"
              >
                Servicio de Interés
              </label>
              <select
                id="servicio_interes"
                name="servicio_interes"
                value={formData.servicio_interes}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecciona un servicio</option>
                {interesesEmpresa.map((interes) => (
                  <option key={interes.id_interes} value={interes.id_interes}>
                    {interes.nombre_interes}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                ¿Posee vehículo?
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="vehiculo"
                    value="si"
                    checked={formData.vehiculo === "si"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-700">Sí</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="vehiculo"
                    value="no"
                    checked={formData.vehiculo === "no"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Enviando Postulación..." : "Enviar Postulación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyVacantes;
