
import { useState } from "react";
import styles from './LoginAdmin.module.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

export const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [estadoLogin, setEstadoLogin] = useState('')

    const navigate = useNavigate(); 

    const [errors, setErrors] = useState({});

    function validate(){
        const newErrors = {}; 
        if(!email) newErrors.email = "El email es obligatorio"; 
        if(!password) newErrors.password = "El password es obligatorio"; 
        setErrors(newErrors); 
        return Object.keys(newErrors).length === 0; 
    }

    const handleChangeEmail = (e) =>{ 
        setEmail(e.target.value)
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value) 
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if(validate()){
            alert("Formulario enviado con éxito")
        }

        const credenciales = {
            email: email,
            password: password
        }
        try {
            const response  = await axios.post('https://novum-app.onrender.com/login', credenciales, {
            headers: {
                'Content-Type': 'application/json'
            },
            }); 
            if(response.data.success){
                setEstadoLogin('Inicio de sesion exitoso!')
                navigate('/frontend/src/pages/Admin.jsx')
            }
            else{
                setEstadoLogin(`Error de inicio de sesion: ${response.data.message}`)
            }
        }catch (error) {
            const errorMessage = error.response
                ? error.response.data.message || 'Error desconocido del servidor.'
                : error.message; 
            console.error('Error al iniciar sesión:', error);
            setEstadoLogin(`Error al iniciar sesión: ${errorMessage}`);
        }
    }


    return(
        <>
            <section className = {styles.loginContainer}>
                <div className = {styles.formContainer}>
                    <div className  = {styles.textForm}>
                        <h2 className= {styles.title}>Bienvenido</h2>
                        <p className = {styles.p}>Ingresa tus credenciales para acceder a tu cuenta</p>
                    </div>
                    <form action="" onSubmit = {handleSubmit} className = {styles.form}>
                        <label htmlFor="" className = {styles.label}>Correo electrónico</label>
                        {errors.email && <p style = {{color: "red"}}>{errors.email}</p>}
                        <div className = {styles.inputContainer}>
                            <svg className = {styles.svg}  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-mail"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" /><path d="M3 7l9 6l9 -6" /></svg>
                            <input type="email" name="email" value = {email} onChange = {handleChangeEmail} placeholder = "Tu @email" className = {styles.input} />
                        </div>
                        <label htmlFor="" className = {styles.label}>Contraseña</label>
                        {errors.password && <p style = {{color: "red"}}>{errors.password}</p>}
                        <div className = {styles.inputContainer}>
                            <svg className = {styles.svg}  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-lock"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M8 11v-4a4 4 0 1 1 8 0v4" /></svg>
                            <input type="password" name="password" value = {password} onChange = {handleChangePassword} placeholder = "Tu contraseña" className = {styles.input} />
                        </div>
                        <button type="submit" className = {styles.buttonForm}>
                            Iniciar Sesion 
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" />
                            </svg>
                        </button>
                        {estadoLogin && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{estadoLogin}</p>}
                    </form>
                </div>
            </section>
        </>
    )
}



