import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import styles from './VacanteDetalle.module.scss'


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
                console.log("Datos recibidos del backend:", data);
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
        <section className={styles.containerDetalle}>
            <div className={styles.containerTitle}>
                <div>
                    <Briefcase />
                    <h1>{vacante.titulo_cargo}</h1>
                </div>
                <Link className={styles.button} to={`/vacantes/${vacante.id_vacante}/postulaciones`}>Aplicar Ahora</Link>
            </div>
            <div>
                <h2 className={styles.titles}>Descripción</h2>
                {vacante.descripcion_corta}
            </div>
            <div>
                <h2 className={styles.titles}>Responsabilidades</h2>
                <ul className={styles.list}>
                    {vacante.responsabilidades.map((responsabilidad, index) => (
                        <li key={index} className={styles.text}>
                            {responsabilidad}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className={styles.titles}>Requisitos</h2>
                <ul className={styles.list}>
                    {vacante.requisitos.map((requisito, index) => (
                        <li key={index} className={styles.text}>
                            {requisito}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className={styles.titles}>Beneficios</h2>
                <ul className={styles.list}>
                    {vacante.beneficios.map((beneficio, index) => (
                        <li key={index} className={styles.text}>
                            {beneficio}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}