import styles from '../styles/About.module.scss';
import { CardsAboutUs } from '../components/CardsAbout/CardsAbout';


export const About = () => {

    const cards = [
        {
            id:1, 
            numero: 100,
            texto: 'Empresas Atendidas'
        },
        {
            id:2,
            numero:8,
            texto:'Años de Experiencia'
        },
        {
            id:3,
            numero:98,
            texto:'Satisfacción del Cliente'
        }
    ]

    return (
        <section className = {styles.containerAbout}>
            <div>
                <div className={styles.titlesAbout}>
                <h1>Sobre Nosotros</h1>
                <p>Es más que una empresa; es la materialización de ideas de software, la búsqueda constante <br /> de la excelencia y la convicción de que cualquier proyecto, por ambisioso que sea, es viable y alcanzable</p>
            </div>
            <section>
                <div className={styles.containerCardAbout}>
                    {
                    cards.map(card => (
                        <CardsAboutUs 
                            key = {card.id}
                            numero = {card.numero}
                            texto = {card.texto}
                        />
                    ))
                    }
                </div>
            </section>
            </div>
        </section>
    )
}