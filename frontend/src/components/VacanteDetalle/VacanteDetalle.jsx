import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';


export const VacanteDetalle = () => {

    const {id} = useParams();
    const [vacante, setVacante] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const isLocalhost = window.location.hostname === 'localhost';
    const API_URL = isLocalhost
        ? 'http://localhost:3000/api/vacantes'
        : 'https://novum-app.onrender.com/api/vacantes';


    useEffect(() => {
        const fetchVacantes = async () => {
            try{
                const response = await fetch(`${API_URL}/${id}`, {
                    method:'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`)
                }
                const data = await response.json(); 
                setVacante(data);
            }catch (err){
                setError(err.message || 'No se pudo cargar los detalles de la vacante');
            }finally{
                setLoading(false)
            }
        }
        fetchVacantes()
    }, [id, API_URL])

    if (loading) return <div>Cargando detalles de la vacante...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!vacante) return <div>Vacante no encontrada.</div>;

    return (
        <section>
            <div>
                <div>
                    <Briefcase />
                    <h1>{vacante.titulo_cargo}</h1>
                </div>
                <Link>Aplicar Ahora</Link>
            </div>
            <div>
                <h2>Descripción</h2>
                {vacante.descripcion_corta}
            </div>
            <div>
                <h2>Responsabilidades</h2>
                {vacante.responsabilidades}
            </div>
            <div>
                <h2>Requisitos</h2>
                {vacante.requisitos}
            </div>
            <div>
                <h2>Beneficios</h2>
                {vacante.beneficios}
            </div>
        </section>
    )
}