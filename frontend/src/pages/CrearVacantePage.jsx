// frontend/src/pages/CrearVacantePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirigir después de crear

const CrearVacantePage = () => {
    const navigate = useNavigate(); // Hook para navegación

    // Estado inicial para los campos del formulario
    const [formData, setFormData] = useState({
        titulo_cargo: '',
        area: '',
        descripcion_corta: '',
        responsabilidades: '',
        requisitos: '',
        beneficios: '',
        salario: '', // Tipo string para el input, se convertirá a numérico al enviar
        id_servicio_interes: '' // Asumimos un select para esto o input numérico
    });
    const [serviciosInteres, setServiciosInteres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Cargar los servicios de interés para el select (simulado por ahora)
    useEffect(() => {
        // Aquí iría la llamada a tu API si tuvieras un endpoint para servicios de interés
        // Ejemplo:
        /*
        const fetchServiciosInteres = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/servicios-interes`);
                setServiciosInteres(response.data);
            } catch (err) {
                console.error('Error al cargar servicios de interés:', err);
            }
        };
        fetchServiciosInteres();
        */
        // Datos simulados para que el select funcione mientras no tengas el endpoint de servicios
        setServiciosInteres([
            { id_interes: 1, nombre_interes: 'Desarrollo Web' },
            { id_interes: 2, nombre_interes: 'Marketing Digital' },
            { id_interes: 3, nombre_interes: 'Recursos Humanos' },
        ]);
    }, []);


    // Manejador de cambios para todos los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Manejador para el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Convertir salario a número si no es nulo o vacío
            const dataToSend = {
                ...formData,
                salario: formData.salario === '' ? null : parseFloat(formData.salario),
                creado_por_usuario_id: 1 // Hardcodeado para pruebas, en real vendría del usuario autenticado
            };

            // Realiza la petición POST a tu API de vacantes
            // ¡IMPORTANTE! Usa la variable de entorno para la URL del backend
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/vacantes`, dataToSend);

            setSuccessMessage('Vacante creada exitosamente!');
            console.log('Vacante creada:', response.data);

            // Limpiar el formulario
            setFormData({
                titulo_cargo: '', area: '', descripcion_corta: '',
                responsabilidades: '', requisitos: '', beneficios: '',
                salario: '', id_servicio_interes: ''
            });

            // Redirige a la página principal de vacantes (donde se listan)
            navigate('/'); 

        } catch (err) {
            console.error('Error al crear la vacante:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Error al crear la vacante. Verifica los datos o el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl bg-white rounded-lg shadow-md mt-8">
            <h1 className="text-3xl font-bold text-center mb-8">Crear Nueva Vacante</h1>

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="titulo_cargo" className="block text-gray-700 text-sm font-bold mb-2">Título del Cargo:</label>
                    <input
                        type="text" id="titulo_cargo" name="titulo_cargo"
                        value={formData.titulo_cargo} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="area" className="block text-gray-700 text-sm font-bold mb-2">Área:</label>
                    <input
                        type="text" id="area" name="area"
                        value={formData.area} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="descripcion_corta" className="block text-gray-700 text-sm font-bold mb-2">Descripción Corta:</label>
                    <textarea
                        id="descripcion_corta" name="descripcion_corta"
                        value={formData.descripcion_corta} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                        required
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="responsabilidades" className="block text-gray-700 text-sm font-bold mb-2">Responsabilidades:</label>
                    <textarea
                        id="responsabilidades" name="responsabilidades"
                        value={formData.responsabilidades} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="requisitos" className="block text-gray-700 text-sm font-bold mb-2">Requisitos:</label>
                    <textarea
                        id="requisitos" name="requisitos"
                        value={formData.requisitos} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                        required
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="beneficios" className="block text-gray-700 text-sm font-bold mb-2">Beneficios:</label>
                    <textarea
                        id="beneficios" name="beneficios"
                        value={formData.beneficios} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="salario" className="block text-gray-700 text-sm font-bold mb-2">Salario (opcional, numérico):</label>
                    <input
                        type="number" id="salario" name="salario"
                        value={formData.salario} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        step="0.01" // Permite decimales
                    />
                </div>

                <div>
                    <label htmlFor="id_servicio_interes" className="block text-gray-700 text-sm font-bold mb-2">Servicio de Interés:</label>
                    <select
                        id="id_servicio_interes" name="id_servicio_interes"
                        value={formData.id_servicio_interes} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Selecciona un servicio</option>
                        {serviciosInteres.map(servicio => (
                            <option key={servicio.id_interes} value={servicio.id_interes}>
                                {servicio.nombre_interes}
                            </option>
                        ))}
                    </select>
                    <p className="text-gray-500 text-xs mt-1">
                        (Si no tienes servicios de interés, puedes dejarlo en blanco o codificar un ID válido directamente en el código por ahora. El backend usa `creado_por_usuario_id = 1` por defecto.)
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : 'Crear Vacante'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearVacantePage;