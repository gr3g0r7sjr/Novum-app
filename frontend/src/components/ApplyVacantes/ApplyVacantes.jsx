import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// No se necesita importar styles si se usa Tailwind directamente
// import styles from "./ApplyVacantes.module.scss";

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
    // Nuevos campos
    tipo_identificacion: "", // 'V', 'E', 'P' (Venezolano, Extranjero, Extranjero Residente)
    cedula: "",
    fecha_nacimiento: "", // Formato YYYY-MM-DD
    // Campos estructurados inicializados con un objeto vacío para que aparezcan por defecto
    educacion: [{ institucion: "", titulo: "", fechaInicio: "", fechaFin: "" }],
    experiencia_laboral: [
      {
        empresa: "",
        puesto: "",
        fechaInicio: "",
        fechaFin: "",
      },
    ],
    cursos_certificaciones: [
      { nombre: "", institucion: "", fechaObtencion: "" },
    ],
    habilidades: [{ nombre: "" }],
    servicio_interes: "", 
    vehiculo: "", 
  });

  // Estado para la lista de intereses de la empresa (para el select)
  const [interesesEmpresa, setInteresesEmpresa] = useState([]);
  const [loading, setLoading] = useState(true); // Para la carga inicial de intereses
  const [submitting, setSubmitting] = useState(false); // Para el envío del formulario
  const [error, setError] = useState(null); // Para errores de carga de intereses
  const [submissionError, setSubmissionError] = useState(null); // Para errores de envío
  const [successMessage, setSuccessMessage] = useState(null); // Para mensajes de éxito

  useEffect(() => {
    const fetchIntereses = async () => {
      try {
        
        const response = await fetch(
          `${API_BASE_URL}/vacantes/servicios-interes`
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
  }, [API_BASE_URL]); 

  // Manejador de cambios para campos simples (texto, email, telefono, select, radio, date)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- Manejadores para campos estructurados (Educación, Experiencia, Cursos, Habilidades) ---

  // Añadir un nuevo elemento a un array estructurado
  const handleAddItem = (field) => {
    setFormData((prevData) => {
      let newItem = {};
      switch (field) {
        case "educacion":
          newItem = {
            institucion: "",
            titulo: "",
            fechaInicio: "",
            fechaFin: "",
          };
          break;
        case "experiencia_laboral":
          newItem = {
            empresa: "",
            puesto: "",
            fechaInicio: "",
            fechaFin: "",
          };
          break;
        case "cursos_certificaciones":
          newItem = { nombre: "", institucion: "", fechaObtencion: "" };
          break;
        case "habilidades":
          newItem = { nombre: "" };
          break;
        default:
          break;
      }
      return {
        ...prevData,
        [field]: [...prevData[field], newItem],
      };
    });
  };

  // Eliminar un elemento de un array estructurado
  const handleRemoveItem = (field, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }));
  };

  // Manejar cambios en campos dentro de elementos estructurados
  const handleStructuredChange = (field, index, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedArray = [...prevData[field]];
      updatedArray[index] = {
        ...updatedArray[index],
        [name]: value,
      };
      return {
        ...prevData,
        [field]: updatedArray,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionError(null);
    setSuccessMessage(null);

    // Preparar los datos para enviar
    const dataToSend = {
      id_vacante: parseInt(idVacante, 10), // Asegúrate de que idVacante sea un número
      ...formData,
      // Convertir servicio_interes a número si existe
      servicio_interes: formData.servicio_interes
        ? parseInt(formData.servicio_interes, 10)
        : null,
      // Asegúrate que vehiculo sea 'si' o 'no', o null si no se selecciona
      vehiculo: formData.vehiculo || null,
      // Asegurar que fecha_nacimiento se envíe como string de fecha (YYYY-MM-DD)
      fecha_nacimiento: formData.fecha_nacimiento || null,
    };

    console.log("Datos del Candidato a enviar:", dataToSend);

    try {
      const response = await fetch(
        `${API_BASE_URL}/vacantes/${idVacante}/postulaciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

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
        tipo_identificacion: "",
        cedula: "",
        fecha_nacimiento: "",
        educacion: [
          { institucion: "", titulo: "", fechaInicio: "", fechaFin: "" },
        ],
        experiencia_laboral: [
          {
            empresa: "",
            puesto: "",
            fechaInicio: "",
            fechaFin: "",
            descripcion: "",
          },
        ],
        cursos_certificaciones: [
          { nombre: "", institucion: "", fechaObtencion: "" },
        ],
        habilidades: [{ nombre: "" }],
        servicio_interes: "",
        vehiculo: "",
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
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Cargando intereses...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">
        Error al cargar intereses: {error}
      </div>
    );

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-3xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Postúlate a la Vacante {idVacante ? `(#${idVacante})` : ""}
        </h1>

        {/* Mensajes de estado */}
        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative mb-4"
            role="alert"
          >
            {successMessage}
          </div>
        )}
        {submissionError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4"
            role="alert"
          >
            {submissionError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección de Datos Personales */}
          <fieldset className="border border-gray-300 p-4 sm:p-6 rounded-md">
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
                  Número de Teléfono (Ej: 04129722981)
                </label>
                <input
                  type="tel"
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

              {/* Nuevos campos de identificación y fecha de nacimiento */}
              <div>
                <label
                  htmlFor="tipo_identificacion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipo de Identificación
                </label>
                <select
                  id="tipo_identificacion"
                  name="tipo_identificacion"
                  value={formData.tipo_identificacion}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecciona</option>
                  <option value="V">Venezolano</option>
                  <option value="E">Extranjero</option>
                  <option value="P">Extranjero Residente</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="cedula"
                  className="block text-sm font-medium text-gray-700"
                >
                  Número de Cédula/Identificación
                </label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  maxLength={8}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="fecha_nacimiento"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </fieldset>

          {/* Sección de Educación */}
          <fieldset className="border border-gray-300 p-4 sm:p-6 rounded-md">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2">
              Educación
            </legend>
            {formData.educacion.map((edu, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-200 rounded-md bg-gray-50"
              >
                <div>
                  <label
                    htmlFor={`institucion-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Institución
                  </label>
                  <input
                    type="text"
                    id={`institucion-${index}`}
                    name="institucion"
                    value={edu.institucion}
                    onChange={(e) =>
                      handleStructuredChange("educacion", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`titulo-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Título Obtenido
                  </label>
                  <input
                    type="text"
                    id={`titulo-${index}`}
                    name="titulo"
                    value={edu.titulo}
                    onChange={(e) =>
                      handleStructuredChange("educacion", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`fechaInicioEdu-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha Inicio
                  </label>
                  <input
                    type="month"
                    id={`fechaInicioEdu-${index}`}
                    name="fechaInicio"
                    value={edu.fechaInicio}
                    onChange={(e) =>
                      handleStructuredChange("educacion", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`fechaFinEdu-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha Fin
                  </label>
                  <input
                    type="month"
                    id={`fechaFinEdu-${index}`}
                    name="fechaFin"
                    value={edu.fechaFin}
                    onChange={(e) =>
                      handleStructuredChange("educacion", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="md:col-span-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("educacion", index)}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Eliminar Educación
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem("educacion")}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Añadir Educación
            </button>
          </fieldset>

          {/* Sección de Experiencia Laboral */}
          <fieldset className="border border-gray-300 p-4 sm:p-6 rounded-md">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2">
              Experiencia Laboral
            </legend>
            {formData.experiencia_laboral.map((exp, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-200 rounded-md bg-gray-50"
              >
                <div>
                  <label
                    htmlFor={`empresa-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Empresa
                  </label>
                  <input
                    type="text"
                    id={`empresa-${index}`}
                    name="empresa"
                    value={exp.empresa}
                    onChange={(e) =>
                      handleStructuredChange("experiencia_laboral", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`puesto-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Puesto
                  </label>
                  <input
                    type="text"
                    id={`puesto-${index}`}
                    name="puesto"
                    value={exp.puesto}
                    onChange={(e) =>
                      handleStructuredChange("experiencia_laboral", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`fechaInicioExp-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha Inicio
                  </label>
                  <input
                    type="month"
                    id={`fechaInicioExp-${index}`}
                    name="fechaInicio"
                    value={exp.fechaInicio}
                    onChange={(e) =>
                      handleStructuredChange("experiencia_laboral", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`fechaFinExp-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha Fin (o "Actual")
                  </label>
                  <input
                    type="month"
                    id={`fechaFinExp-${index}`}
                    name="fechaFin"
                    value={exp.fechaFin}
                    onChange={(e) =>
                      handleStructuredChange("experiencia_laboral", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="md:col-span-2 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem("experiencia_laboral", index)
                    }
                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Eliminar Experiencia
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem("experiencia_laboral")}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Añadir Experiencia Laboral
            </button>
          </fieldset>

          {/* Sección de Cursos y Certificaciones */}
          <fieldset className="border border-gray-300 p-4 sm:p-6 rounded-md">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2">
              Cursos y Certificaciones
            </legend>
            {formData.cursos_certificaciones.map((cert, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-200 rounded-md bg-gray-50"
              >
                <div>
                  <label
                    htmlFor={`nombreCert-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre del Curso/Certificación
                  </label>
                  <input
                    type="text"
                    id={`nombreCert-${index}`}
                    name="nombre"
                    value={cert.nombre}
                    onChange={(e) =>
                      handleStructuredChange("cursos_certificaciones", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`institucionCert-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Institución
                  </label>
                  <input
                    type="text"
                    id={`institucionCert-${index}`}
                    name="institucion"
                    value={cert.institucion}
                    onChange={(e) =>
                      handleStructuredChange("cursos_certificaciones", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor={`fechaObtencionCert-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de Obtención
                  </label>
                  <input
                    type="month"
                    id={`fechaObtencionCert-${index}`}
                    name="fechaObtencion"
                    value={cert.fechaObtencion}
                    onChange={(e) =>
                      handleStructuredChange("cursos_certificaciones", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="md:col-span-2 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem("cursos_certificaciones", index)
                    }
                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Eliminar Certificación
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem("cursos_certificaciones")}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Añadir Curso/Certificación
            </button>
          </fieldset>

          {/* Sección de Habilidades */}
          <fieldset className="border border-gray-300 p-4 sm:p-6 rounded-md">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2">
              Habilidades
            </legend>
            {formData.habilidades.map((habilidad, index) => (
              <div
                key={index}
                className="flex items-center gap-4 mb-4 p-4 border border-gray-200 rounded-md bg-gray-50"
              >
                <div className="flex-grow">
                  <label
                    htmlFor={`habilidad-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Habilidad
                  </label>
                  <input
                    type="text"
                    id={`habilidad-${index}`}
                    name="nombre"
                    value={habilidad.nombre}
                    onChange={(e) =>
                      handleStructuredChange("habilidades", index, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem("habilidades", index)}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 self-end"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem("habilidades")}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Añadir Habilidad
            </button>
          </fieldset>

          {/* Sección de Preferencias y Otros Datos */}
          <fieldset className="border border-gray-300 p-4 sm:p-6 rounded-md">
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
