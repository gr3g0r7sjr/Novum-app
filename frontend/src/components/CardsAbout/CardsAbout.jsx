import styles from '../CardsAbout/CardsAbout.module.scss'

export const CardsAboutUs = (props) => {

    const {numero, texto} = props; 
    return(
        <div className={styles.cards}>
            <p>{numero}</p>
            <p>{texto}</p>
        </div>
    )
    
}