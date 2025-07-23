// frontend/src/pages/CrearVacantePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CrearVacantePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo_cargo: "",
    area: "",
    descripcion_corta: "",
    responsabilidades: "",
    requisitos: "",
    beneficios: "",
    salario: "",
    id_servicio_interes: "",
  });

  const [serviciosInteres, setServiciosInteres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [error, setError] = useState(null);
  const [errorServicios, setErrorServicios] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:3000/api"
    : "https://novum-app.onrender.com/api";

  // Función para obtener el token JWT del localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem("jwt_token");
    console.log(
      "DEBUG: Token de localStorage en getAuthToken():",
      token ? "Encontrado" : "NULO",
    ); // <-- DEBUG
    return token;
  };

  // Función para manejar la redirección al login y limpiar la sesión
  const handleUnauthorized = () => {
    console.log(
      "DEBUG: Sesión no autorizada/expirada. Limpiando token y redirigiendo.",
    ); // <-- DEBUG
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_info");
    setError(
      "Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.",
    );
    setTimeout(() => navigate("/login"), 1500);
  };

  // Cargar los servicios de interés al montar el componente
  useEffect(() => {
    //console.log('DEBUG: useEffect para cargar servicios se está ejecutando.'); // <-- DEBUG
    const fetchServiciosInteres = async () => {
      setLoadingServicios(true);
      setErrorServicios(null);
      try {
        const token = getAuthToken(); // Intenta obtener el token

        if (!token) {
          //console.log('DEBUG: No se encontró token al intentar cargar servicios.'); // <-- DEBUG
          setErrorServicios(
            "No autenticado. Por favor, inicia sesión para cargar servicios.",
          );
          setLoadingServicios(false);
          return;
        }

        console.log(
          "DEBUG: Token encontrado para cargar servicios. Intentando fetch...",
        ); // <-- DEBUG
        // ¡CORRECCIÓN AQUÍ! Cambiado a `/vacantes/servicios-interes`
        const response = await fetch(
          `${API_BASE_URL}/vacantes/servicios-interes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          console.log(
            "DEBUG: Respuesta no OK al cargar servicios. Status:",
            response.status,
          ); // <-- DEBUG
          if (response.status === 401 || response.status === 403) {
            handleUnauthorized();
            return;
          }
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al cargar los servicios de interés.",
          );
        }

        const data = await response.json();
        setServiciosInteres(data);
        //console.log('DEBUG: Servicios cargados exitosamente.'); // <-- DEBUG
      } catch (err) {
        console.error("DEBUG: Error en fetchServiciosInteres:", err); // <-- DEBUG
        setErrorServicios(
          err.message || "No se pudieron cargar los servicios de interés.",
        );
        setServiciosInteres([]);
      } finally {
        setLoadingServicios(false);
      }
    };

    fetchServiciosInteres();
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.titulo_cargo.trim()) {
      errors.titulo_cargo = "El título del cargo es obligatorio.";
    } else if (formData.titulo_cargo.trim().length < 3) {
      errors.titulo_cargo =
        "El título del cargo debe tener al menos 3 caracteres.";
    }

    if (!formData.area.trim()) {
      errors.area = "El área es obligatoria.";
    }

    if (!formData.descripcion_corta.trim()) {
      errors.descripcion_corta = "La descripción corta es obligatoria.";
    } else if (formData.descripcion_corta.trim().length < 10) {
      errors.descripcion_corta =
        "La descripción corta debe tener al menos 10 caracteres.";
    }

    if (!formData.requisitos.trim()) {
      errors.requisitos = "Los requisitos son obligatorios.";
    } else if (formData.requisitos.trim().length < 10) {
      errors.requisitos = "Los requisitos deben tener al menos 10 caracteres.";
    }

    if (formData.salario !== "" && isNaN(parseFloat(formData.salario))) {
      errors.salario = "El salario debe ser un número válido.";
    } else if (formData.salario !== "" && parseFloat(formData.salario) < 0) {
      errors.salario = "El salario no puede ser negativo.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      setError("Por favor, corrige los errores en el formulario.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = getAuthToken();
      if (!token) {
        console.log("DEBUG: No se encontró token al intentar crear vacante."); // <-- DEBUG
        setError("No autenticado. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      const responsabilidadesArray = formData.responsabilidades
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");
      const requisitosArray = formData.requisitos
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");
      const beneficiosArray = formData.beneficios
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      const dataToSend = {
        ...formData,
        responsabilidades: responsabilidadesArray,
        requisitos: requisitosArray,
        beneficios: beneficiosArray,
        salario: formData.salario === "" ? null : parseFloat(formData.salario),
      };

      console.log(
        "DEBUG: Token encontrado para crear vacante. Intentando fetch...",
      ); // <-- DEBUG
      const response = await fetch(`${API_BASE_URL}/vacantes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        console.log(
          "DEBUG: Respuesta no OK al crear vacante. Status:",
          response.status,
        ); // <-- DEBUG
        if (response.status === 401 || response.status === 403) {
          handleUnauthorized();
          return;
        }
        const errorData = await response.json();
        if (errorData.errors) {
          setFormErrors(errorData.errors);
          setError(
            errorData.message ||
              "Error de validación en el servidor. Por favor, revisa los campos.",
          );
        } else {
          throw new Error(
            errorData.message || "Error desconocido al crear la vacante.",
          );
        }
        return;
      }

      const responseData = await response.json();
      setSuccessMessage("Vacante creada exitosamente!");
      console.log("DEBUG: Vacante creada exitosamente:", responseData); // <-- DEBUG

      setFormData({
        titulo_cargo: "",
        area: "",
        descripcion_corta: "",
        responsabilidades: "",
        requisitos: "",
        beneficios: "",
        salario: "",
        id_servicio_interes: "",
      });
      setFormErrors({});
      navigate("/vacantes");
    } catch (err) {
      console.error("DEBUG: Error en handleSubmit:", err); // <-- DEBUG
      setError(
        err.message ||
          "Error al crear la vacante. Verifica los datos o el servidor.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Crear Nueva Vacante
      </h1>

      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loadingServicios ? (
        <p className="text-center text-gray-600">
          Cargando servicios de interés...
        </p>
      ) : errorServicios ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{errorServicios}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="titulo_cargo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Título del Cargo:
          </label>
          <input
            type="text"
            id="titulo_cargo"
            name="titulo_cargo"
            value={formData.titulo_cargo}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors.titulo_cargo ? "border-red-500" : ""}`}
            required
          />
          {formErrors.titulo_cargo && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.titulo_cargo}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="area"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Área:
          </label>
          <input
            type="text"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors.area ? "border-red-500" : ""}`}
            required
          />
          {formErrors.area && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.area}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="descripcion_corta"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Descripción Corta:
          </label>
          <textarea
            id="descripcion_corta"
            name="descripcion_corta"
            value={formData.descripcion_corta}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20 ${formErrors.descripcion_corta ? "border-red-500" : ""}`}
            required
          ></textarea>
          {formErrors.descripcion_corta && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.descripcion_corta}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="responsabilidades"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Responsabilidades:
          </label>
          <textarea
            id="responsabilidades"
            name="responsabilidades"
            value={formData.responsabilidades}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
            placeholder="Escribe cada responsabilidad en una nueva línea."
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="requisitos"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Requisitos:
          </label>
          <textarea
            id="requisitos"
            name="requisitos"
            value={formData.requisitos}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20 ${formErrors.requisitos ? "border-red-500" : ""}`}
            required
            placeholder="Escribe cada requisito en una nueva línea."
          ></textarea>
          {formErrors.requisitos && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.requisitos}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="beneficios"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Beneficios:
          </label>
          <textarea
            id="beneficios"
            name="beneficios"
            value={formData.beneficios}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
            placeholder="Escribe cada beneficio en una nueva línea."
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="salario"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Salario (opcional, numérico):
          </label>
          <input
            type="number"
            id="salario"
            name="salario"
            value={formData.salario}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors.salario ? "border-red-500" : ""}`}
            step="0.01"
          />
          {formErrors.salario && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.salario}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="id_servicio_interes"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Servicio de Interés:
          </label>
          <select
            id="id_servicio_interes"
            name="id_servicio_interes"
            value={formData.id_servicio_interes}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={loadingServicios}
          >
            <option value="">Selecciona un servicio</option>
            {!loadingServicios &&
              !errorServicios &&
              serviciosInteres.map((servicio) => (
                <option key={servicio.id_interes} value={servicio.id_interes}>
                  {servicio.nombre_interes}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Vacante"}
          </button>
        </div>
      </form>
    </div>
  );
};
