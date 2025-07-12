import styles from '../styles/About.module.scss';
import { CardsAboutUs } from '../components/CardsAbout/CardsAbout';
import { CardsMisionVision } from '../components/CardsAbout/CardsMisionVision';
import { Goal, Eye } from 'lucide-react';


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

    const cardsMisionVision = [
        {
            id:1,
            icono: <Goal color='#ff8500' />, 
            titulo: 'Nuestra Misión',
            texto: 'Hacer de las instituciones financieras un buen negocio: competitivos, rapidos con nuevos productos y servicios a menores costos en cumplimiento de las regulaciones.' 
        },
        {
            id:1,
            icono: <Eye color='#003091' />, 
            titulo: 'Nuestra Visión',
            texto: 'Ser referencia, reconocidos en el sector financiero nacional por trabajar con los mejores talentos y clientes para impulsar nuestro mercado a nivel internacional.' 
        }
    ]

    return (
        <section className = {styles.containerAbout}>
            <div className={styles.container}>
                <div className={styles.titlesAbout}>
                    <h1>Sobre Nosotros</h1>
                    <p>Es más que una empresa; es la materialización de ideas de software, la búsqueda constante <br /> de la excelencia y la convicción de que cualquier proyecto, por ambisioso que sea, es viable y alcanzable</p>
                </div>
                <section className={styles.containerInfo}>
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
                    <div className={styles.containerMision}>
                        {
                            cardsMisionVision.map(card => (
                                <CardsMisionVision
                                    key={card.id}
                                    icono = {card.icono}
                                    titulo = {card.titulo}
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