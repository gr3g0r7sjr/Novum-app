import styles from '../cardsContacto/cardsContacto.module.scss'; 

export const CardsContacto = (props) => {

    const {titulo, imageUrl, parrafo, parrafo2} = props; 

    return (
        <div>
            <div className={styles.cardContainer}>
                <figure className="">
                    <img src={imageUrl} alt="" />
                </figure>
                <h4 className={styles.font}>{titulo}</h4>
                <p>{parrafo}</p>
                <p>{parrafo2}</p>
            </div>
        </div>
    )
}