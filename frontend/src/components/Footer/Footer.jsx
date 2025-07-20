import styles from '../Footer/Footer.module.scss'
import novumLogo from "../../assets/novum-logo.png"
import { Linkedin } from 'lucide-react'

export const Footer = () => {


    return (
        <footer className={styles.containerFooter}>
            <section className={styles.footer}>
                <div>
                    <div>
                    
                    </div>
                    <div>
                        <h3>Siguenos</h3>
                        <div>
                            <ul>
                                <li>
                                    <a href=""></a>
                                </li>
                                <li>
                                    <a href=""></a>
                                </li>
                                <li>
                                    <a href=""></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.containerTerminos}>
                    <div>
                        <p>2025 Novum - Web de Captacion y seleccion de personal. Todos los derechos reservados.</p>
                    </div>
                    <div className={styles.politicas}>
                        <p>Terminos y Condiciones</p>
                        <p>Política de Privacidad</p>
                    </div>
                </div>
            </section>
        </footer>
    )
}