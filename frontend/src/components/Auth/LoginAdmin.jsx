import { useState } from "react";
import styles from './LoginAdmin.module.scss'; // Asumo que este archivo de estilos existe
import { useNavigate } from 'react-router-dom';

export const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [estadoLogin, setEstadoLogin] = useState(''); // Para mensajes de éxito/error del login
    const [loading, setLoading] = useState(false); // Nuevo estado para el indicador de carga
    const [errors, setErrors] = useState({}); // Para errores de validación del formulario

    const navigate = useNavigate();

    // Determina la URL base de la API
    const isLocalhost = window.location.hostname === 'localhost';
    const API_URL = isLocalhost
        ? 'http://localhost:3000/api/login' // Tu backend se ejecuta en el puerto 3000
        : 'https://novum-app.onrender.com/api/login'; // URL de tu backend desplegado

    // Función de validación del formulario (frontend)
    function validate() {
        const newErrors = {};
        if (!email) newErrors.email = "El email es obligatorio";
        if (!password) newErrors.password = "La contraseña es obligatoria";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
    }

    // Manejadores de cambio para los inputs
    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
        // Limpiar error de email si el usuario empieza a escribir
        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
        // Limpiar error de password si el usuario empieza a escribir
        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
    }

    // Manejador del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga de la página

        // 1. Validar el formulario en el frontend
        if (!validate()) {
            setEstadoLogin('Por favor, completa todos los campos obligatorios.');
            return; // Detiene la ejecución si hay errores de validación
        }

        // Elimina el alert de "Formulario enviado con éxito"
        // alert("Formulario enviado con éxito"); // <-- ELIMINADO

        setLoading(true); // Activa el estado de carga
        setEstadoLogin(''); // Limpia mensajes de estado previos

        const credenciales = {
            email: email,
            password: password
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credenciales)
            });

            const responseData = await response.json(); // Parsea la respuesta JSON

            if (response.ok) { // Si la respuesta HTTP es 2xx (ej. 200 OK)
                if (responseData.success) {
                    // ¡AQUÍ ES DONDE GUARDAS EL TOKEN JWT Y LA INFO DEL USUARIO!
                    localStorage.setItem('jwt_token', responseData.token);
                    localStorage.setItem('user_info', JSON.stringify(responseData.user));

                    setEstadoLogin('Inicio de sesión exitoso!');
                    //console.log('Login exitoso, token guardado:', responseData.token);
                    // Redirige al dashboard de administración/RRHH
                    navigate('/admin/dashboard'); // Asegúrate de que esta ruta exista en tu React Router
                } else {
                    // Si la respuesta HTTP es OK (200), pero el backend indica un login fallido (success: false)
                    setEstadoLogin(`Error de inicio de sesión: ${responseData.message}`);
                }
            } else {
                // Si la respuesta HTTP no es OK (ej. 401, 400, 500)
                // Usamos responseData.message si está disponible, o un mensaje genérico
                const errorMessage = responseData.message || 'Error desconocido al iniciar sesión.';
                throw new Error(errorMessage); // Lanza un error para que el catch lo capture
            }
        } catch (error) {
            // Captura errores de red, errores lanzados por `throw new Error`, etc.
            console.error('Error al iniciar sesión:', error);
            // Muestra el mensaje de error al usuario
            setEstadoLogin(`Error al iniciar sesión: ${error.message || 'No se pudo conectar con el servidor.'}`);
        } finally {
            setLoading(false); // Desactiva el estado de carga
        }
    };

    return (
        <>
            <section className={styles.loginContainer}>
                <div className={styles.formContainer}>
                    <div className={styles.textForm}>
                        <h2 className={styles.title}>Bienvenido</h2>
                        <p className={styles.p}>Ingresa tus credenciales para acceder a tu cuenta</p>
                    </div>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <label htmlFor="email" className={styles.label}>Correo electrónico</label>
                        {errors.email && <p style={{ color: "red", fontSize: "0.8em", marginTop: "-5px", marginBottom: "5px" }}>{errors.email}</p>}
                        <div className={styles.inputContainer}>
                            <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" /><path d="M3 7l9 6l9 -6" /></svg>
                            <input
                                type="email" id="email" name="email"
                                value={email} onChange={handleChangeEmail}
                                placeholder="Tu @email" className={styles.input}
                                required // Añadido required para consistencia con la validación
                            />
                        </div>
                        <label htmlFor="password" className={styles.label}>Contraseña</label>
                        {errors.password && <p style={{ color: "red", fontSize: "0.8em", marginTop: "-5px", marginBottom: "5px" }}>{errors.password}</p>}
                        <div className={styles.inputContainer}>
                            <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M8 11v-4a4 4 0 1 1 8 0v4" /></svg>
                            <input
                                type="password" id="password" name="password"
                                value={password} onChange={handleChangePassword}
                                placeholder="Tu contraseña" className={styles.input}
                                required // Añadido required para consistencia con la validación
                            />
                        </div>
                        <button
                            type="submit"
                            className={`${styles.buttonForm} ${loading ? styles.buttonLoading : ''}`}
                            disabled={loading} // Deshabilita el botón durante la carga
                        >
                            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                            {!loading && ( // Muestra el SVG solo si no está cargando
                                <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" /></svg>
                            )}
                        </button>
                        {estadoLogin && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{estadoLogin}</p>}
                    </form>
                </div>
            </section>
        </>
    );
};