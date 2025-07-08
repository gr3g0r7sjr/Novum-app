import styles from '../styles/Contact.module.scss';
import { LoginContacto } from '../components/LoginContacto/LoginContacto.jsx';
import { CardsContacto } from '../components/cardsContacto/cardsContacto.jsx';


export const Contact = () => {

    const cardsData = [
        {
            id:1,
            titulo: 'Teléfono',
            imageUrl : '',
            parrafo : '+58(212)9518337', 
            parrafo2 : '+58(412)3704956'
        },
        {
            id:2,
            titulo: 'Correo Electrónico',
            imageUrl : '',
            parrafo : 'contacto@novumideas.com', 
            parrafo2 : 'rrhh@novumideas.com'
        },
        {
            id:3,
            titulo: 'Ubicación',
            imageUrl : '',
            parrafo : 'Torre Orinoco, Av. La guairita', 
            parrafo2 : 'Caracas, Distrito Capital'
        },
        {
            id:4,
            titulo: 'Horario',
            imageUrl : '',
            parrafo : 'Lunes a Viernes: 8:00 - 5:00', 
        },

    ]
    return(
            <section className={styles.containerContact}>
                <div className={styles.titles}>
                    <h1>Contáctanos</h1>
                    <p>Estamos aqui para ayudarte</p>
                </div>
                <div className={styles.containerForm}>
                    <LoginContacto />
                    <div className={styles.cardsContainer}>
                    {
                        cardsData.map(card => (
                            <CardsContacto
                                key = {card.id}
                                titulo={card.titulo}
                                imageUrl={card.imageUrl}
                                parrafo={card.parrafo}
                                parrafo2={card.parrafo2}
                            />
                        ))
                    }
                    </div>
                </div>
            </section>
    )
}