import styles from '../CardsPreguntas/CardsPreguntas.module.scss'


export const CardsPreguntas = (props) =>{

    const {titulo, texto} = props; 
    return (
        <section className={styles.cardsPreguntas}>
            <div>
                <h3 className={styles.title}>{titulo}</h3>
                <p className={styles.text}>{texto}</p>
            </div>
        </section>
    )
}