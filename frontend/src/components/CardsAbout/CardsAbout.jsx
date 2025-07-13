import styles from '../CardsAbout/CardsAbout.module.scss'

export const CardsAboutUs = (props) => {

    const {numero, texto} = props; 
    return(
        <div className={styles.cards}>
            <h3>{numero}+</h3>
            <p>{texto}</p>
        </div>
    )
    
}