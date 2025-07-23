import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ApplyVacantes.module.scss'; // Importa los módulos SCSS

const ApplyVacantes = () => {
  // Obtenemos el ID de la vacante de los parámetros de la URL
  const { idVacante } = useParams();
  const navigate = useNavigate();

  // Estado para los datos del formulario del candidato
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo_electronico: '',
    numero_telefono: '',
    direccion: '',
    educacion: '',
    experiencia_laboral: '',
    cursos_certificaciones: '',
    habilidades: '',
    servicio_interes: '', // Este será el ID del interés
    vehiculo: '', // 's¡' o 'no'
    fecha_expiracion_datos: '',
  });

  // Estado para la lista de intereses de la empresa (para el select)
  const [interesesEmpresa, setInteresesEmpresa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener los intereses de la empresa
    // Por ahora, usamos datos de ejemplo
    const fetchIntereses = async () => {
      try {
        // Simulación de una llamada a la API
        // const response = await fetch('/api/intereses-empresa');
        // if (!response.ok) {
        //   throw new Error('No se pudieron cargar los intereses de la empresa');
        // }
        // const data = await response.json();
        const data = [
          { id_interes: 1, nombre_interes: 'Desarrollo de Software' },
          { id_interes: 2, nombre_interes: 'Diseño Gráfico' },
          { id_interes: 3, nombre_interes: 'Marketing Digital' },
          { id_interes: 4, nombre_interes: 'Recursos Humanos' },
          { id_interes: 5, nombre_interes: 'Administración' },
        ];
        setInteresesEmpresa(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIntereses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('ID de Vacante:', idVacante);
    console.log('Datos del Candidato a enviar:', formData);

    // Aquí iría la llamada a la API para enviar los datos del candidato
    try {
      // const response = await fetch('/api/postular', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     candidato: formData,
      //     id_vacante: idVacante, // Pasamos el id de la vacante
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Error al enviar la postulación');
      // }

      // const result = await response.json();
      alert('¡Postulación enviada con éxito!');
      navigate('/vacantes'); // Redirigir al usuario a la lista de vacantes o a una página de confirmación
    } catch (err) {
      console.error('Error al postular:', err);
      alert(`Error al enviar la postulación: ${err.message}`);
    }
  };

  if (loading) return <div className={styles.container}>Cargando intereses...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  return (
    <div className={`${styles.container} min-h-screen bg-gray-100 py-10 flex flex-col items-center justify-center`}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Postúlate a la Vacante {idVacante ? `(#${idVacante})` : ''}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección de Datos Personales */}
          <fieldset className="border border-gray-300 p-6 rounded-md">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2">Datos Personales</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
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
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
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
                <label htmlFor="correo_electronico" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
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
                <label htmlFor="numero_telefono" className="block text-sm font-medium text-gray-700">Número de Teléfono</label>
                <input
                  type="text"
                  id="numero_telefono"
                  name="numero_telefono"
                  value={formData.numero_telefono}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
                <textarea
                  id="direccion"
                  name="direccion"
                  rows="3"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
          </fieldset>

          {/* Sección de Educación y Experiencia */}
          <fieldset className="border border-gray-300 p-6 rounded-md">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2">Educación y Experiencia</legend>
            <div>
              <label htmlFor="educacion" className="block text-sm font-medium text-gray-700">Educación</label>
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
              <label htmlFor="experiencia_laboral" className="block text-sm font-medium text-gray-700">Experiencia Laboral</label>
              <textarea
                id="experiencia_laboral"
                name="experiencia_laboral"
                rows="6"
                value={formData.experiencia_laboral}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
            <div className="mt-4">
              <label htmlFor="cursos_certificaciones" className="block text-sm font-medium text-gray-700">Cursos y Certificaciones</label>
              <textarea
                id="cursos_certificaciones"
                name="cursos_certificaciones"
                rows="4"
                value={formData.cursos_certificaciones}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
            <div className="mt-4">
              <label htmlFor="habilidades" className="block text-sm font-medium text-gray-700">Habilidades</label>
              <textarea
                id="habilidades"
                name="habilidades"
                rows="3"
                value={formData.habilidades}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </fieldset>

          {/* Sección de Preferencias y Otros Datos */}
          <fieldset className="border border-gray-300 p-6 rounded-md">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2">Preferencias y Otros</legend>
            <div>
              <label htmlFor="servicio_interes" className="block text-sm font-medium text-gray-700">Servicio de Interés</label>
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
              <label className="block text-sm font-medium text-gray-700">¿Posee vehículo?</label>
              <div className="mt-1 flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="vehiculo"
                    value="s¡"
                    checked={formData.vehiculo === 's¡'}
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
                    checked={formData.vehiculo === 'no'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="fecha_expiracion_datos" className="block text-sm font-medium text-gray-700">Fecha de Expiración de Datos</label>
              <input
                type="date"
                id="fecha_expiracion_datos"
                name="fecha_expiracion_datos"
                value={formData.fecha_expiracion_datos}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enviar Postulación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyVacantes;