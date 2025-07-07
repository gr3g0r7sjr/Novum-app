import styles from '../styles/Contact.module.scss';
import { LoginContacto } from '../components/LoginContacto/LoginContacto';


export const Contact = () => {
    return(
        <>
            <section className={styles.containerContact}>
                <div>
                    <h1>Contactanos</h1>
                    <p>Estamos aqui para ayudarte</p>
                </div>
                <LoginContacto />
            </section>
        </>
    )
}