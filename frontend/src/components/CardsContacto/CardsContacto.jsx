import styles from '../CardsContacto/CardsContacto.module.scss'; 

export const CardsContacto = (props) => {

    const {titulo, imageUrl, parrafo, parrafo2} = props; 

    return (
        <div className={styles.cardContainer}>
            <figure className="">
                {imageUrl}
            </figure>
            <div>
                <h4 className={styles.font}>{titulo}</h4>
                <p>{parrafo}</p>
                <p>{parrafo2}</p>
            </div>
        </div>
    )
}