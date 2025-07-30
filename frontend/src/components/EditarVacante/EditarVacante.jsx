import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EditarVacantePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID de la vacante de la URL

  const [formData, setFormData] = useState({
    titulo_cargo: "",
    descripcion_corta: "",
    responsabilidades: "",
    requisitos: "",
    beneficios: "",
    salario: "",
    id_servicio_interes: "",
    estado: "activa", 
  });

  const [serviciosInteres, setServiciosInteres] = useState([]);
  const [loading, setLoading] = useState(false); // Para el envío del formulario
  const [loadingVacante, setLoadingVacante] = useState(true); // Para cargar la vacante existente
  const [loadingServicios, setLoadingServicios] = useState(true); // Para cargar los servicios de interés
  const [error, setError] = useState(null); // Para errores generales del formulario
  const [errorVacante, setErrorVacante] = useState(null); // Para errores al cargar la vacante
  const [errorServicios, setErrorServicios] = useState(null); // Para errores al cargar los servicios
  const [successMessage, setSuccessMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:3000/api"
    : "https://novum-app.onrender.com/api";

  // Función para obtener el token JWT del localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem("jwt_token");
    return token;
  };

  // Función para manejar la redirección al login y limpiar la sesión
  const handleUnauthorized = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_info");
    setError(
      "Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo."
    );
    setTimeout(() => navigate("/login"), 1500);
  };

  // Cargar los servicios de interés y la vacante al montar el componente
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      handleUnauthorized();
      return;
    }

    // Función para cargar servicios de interés
    const fetchServiciosInteres = async () => {
      setLoadingServicios(true);
      setErrorServicios(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/vacantes/servicios-interes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            handleUnauthorized();
            return;
          }
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al cargar los servicios de interés."
          );
        }
        const data = await response.json();
        setServiciosInteres(data);
      } catch (err) {
        console.error("Error en fetchServiciosInteres:", err);
        setErrorServicios(
          err.message || "No se pudieron cargar los servicios de interés."
        );
        setServiciosInteres([]);
      } finally {
        setLoadingServicios(false);
      }
    };

    // Función para cargar la vacante existente
    const fetchVacante = async () => {
      setLoadingVacante(true);
      setErrorVacante(null);
      try {
        const response = await fetch(`${API_BASE_URL}/vacantes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            handleUnauthorized();
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.message || "Vacante no encontrada.");
        }

        const data = await response.json();
        // Formatear los arrays a strings separados por nueva línea para los textareas
        setFormData({
          ...data,
          responsabilidades: Array.isArray(data.responsabilidades)
            ? data.responsabilidades.join("\n")
            : data.responsabilidades || "",
          requisitos: Array.isArray(data.requisitos)
            ? data.requisitos.join("\n")
            : data.requisitos || "",
          beneficios: Array.isArray(data.beneficios)
            ? data.beneficios.join("\n")
            : data.beneficios || "",
          salario: data.salario !== null ? String(data.salario) : "", // Convertir a string para el input type="number"
          id_servicio_interes: data.id_servicio_interes || "", // Asegurarse de que sea un string o vacío
        });
      } catch (err) {
        console.error("Error en fetchVacante:", err);
        setErrorVacante(err.message || "No se pudo cargar la vacante.");
      } finally {
        setLoadingVacante(false);
      }
    };

    fetchServiciosInteres();
    if (id) {
      fetchVacante();
    } else {
      // Si no hay ID, no se está editando, se puede manejar un error o redirigir
      setErrorVacante("No se proporcionó un ID de vacante para editar.");
      setLoadingVacante(false);
    }
  }, [id, navigate, API_BASE_URL]); // Dependencias para re-ejecutar si cambian

  const validateForm = () => {
    const errors = {};
    if (!formData.titulo_cargo.trim()) {
      errors.titulo_cargo = "El título del cargo es obligatorio.";
    } else if (formData.titulo_cargo.trim().length < 3) {
      errors.titulo_cargo =
        "El título del cargo debe tener al menos 3 caracteres.";
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
        setError("No autenticado. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      // Convertir strings de textarea a arrays, filtrando líneas vacías
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

      const url = `${API_BASE_URL}/vacantes/${id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleUnauthorized();
          return;
        }
        const errorData = await response.json();
        if (errorData.errors) {
          setFormErrors(errorData.errors);
          setError(
            errorData.message ||
              "Error de validación en el servidor. Por favor, revisa los campos."
          );
        } else {
          throw new Error(
            errorData.message || "Error desconocido al guardar la vacante."
          );
        }
        return;
      }

      const responseData = await response.json();
      setSuccessMessage("Vacante actualizada exitosamente!");
      console.log("Vacante guardada exitosamente:", responseData);

      // Redirigir a la lista de vacantes después de guardar
      setTimeout(() => navigate("/admin/vacantes"), 1500);
    } catch (err) {
      console.error("Error en handleSubmit:", err);
      setError(
        err.message ||
          "Error al guardar la vacante. Verifica los datos o el servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingVacante || loadingServicios) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center font-inter">
        <p className="text-xl text-gray-700">Cargando datos de la vacante...</p>
      </div>
    );
  }

  if (errorVacante || errorServicios) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center font-inter">
        <p className="text-xl text-red-500">{errorVacante || errorServicios}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {id ? "Editar Vacante" : "Crear Nueva Vacante"}
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

        {/* Campo de estado, útil para la edición */}
        <div>
          <label
            htmlFor="estado"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Estado de la Vacante:
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};
