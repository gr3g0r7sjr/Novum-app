// frontend/src/pages/VacantesPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importa Axios

const VacantesPage = () => {
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVacantes = async () => {
            try {
                // Realiza la petición GET a tu API de vacantes
                // Asegúrate de que tu backend esté corriendo en http://localhost:3000
                const response = await axios.get('http://localhost:3000/api/vacantes');
                setVacantes(response.data);
            } catch (err) {
                console.error('Error al obtener las vacantes:', err);
                setError('No se pudieron cargar las vacantes. Inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchVacantes();
    }, []); // El array vacío asegura que se ejecuta una sola vez al montar el componente

    if (loading) {
        return <div className="text-center py-8">Cargando vacantes...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (vacantes.length === 0) {
        return <div className="text-center py-8">No hay vacantes disponibles en este momento.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Vacantes Disponibles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vacantes.map((vacante) => (
                    <div key={vacante.id_vacante} className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">{vacante.titulo_cargo}</h2>
                        <p className="text-gray-700 mb-2">**Área:** {vacante.area}</p>
                        <p className="text-gray-600 text-sm mb-4">{vacante.descripcion_corta}</p>
                        <div className="text-right">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VacantesPage;