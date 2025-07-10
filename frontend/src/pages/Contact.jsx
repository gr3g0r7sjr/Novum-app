import styles from '../styles/Contact.module.scss';
import { LoginContacto } from '../components/LoginContacto/LoginContacto.jsx';
import { CardsContacto } from '../components/CardsContacto/CardsContacto.jsx';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';


export const Contact = () => {

    const cardsDataInfo = [
        {
            id:1,
            titulo: 'Teléfono',
            imageUrl : <Phone color='#ff8500' />,
            parrafo : '+58(212)9518337', 
            parrafo2 : '+58(412)3704956'
        },
        {
            id:2,
            titulo: 'Correo Electrónico',
            imageUrl : <Mail color='#ff8500' />,
            parrafo : 'contacto@novumideas.com', 
            parrafo2 : 'rrhh@novumideas.com'
        },
        {
            id:3,
            titulo: 'Ubicación',
            imageUrl : <MapPin color='#ff8500' />,
            parrafo : 'Torre Orinoco, Av. La guairita', 
            parrafo2 : 'Caracas, Distrito Capital'
        },
        {
            id:4,
            titulo: 'Horario',
            imageUrl : <Clock color='#ff8500' />,
            parrafo : 'Lunes a Viernes: 8:00 - 5:00', 
        },

    ]

    const cardsPreguntas = [
        {
            id:1, 
            titulo: '¿Como puedo aplicar a una vacante?',
            texto: 'Para aplicar a una vacante debes ir al area de vacantes, seleccionar al puesto que deseas aplicar, rellenar el formulario con los datos solicitados y enviarlo! Te estaremos dando respuesta en breve...'
        },
        {
            id:2, 
            titulo: '¿Cuánto tarda el proceso de captación?',
            texto: 'Para aplicar a una vacante debes ir al area de vacantes, seleccionar al puesto que deseas aplicar, rellenar el formulario con los datos solicitados y enviarlo! Te estaremos dando respuesta en breve...'
        },
        {
            id:3, 
            titulo: '¿Cómo es el proceso de captación?',
            texto: 'Para aplicar a una vacante debes ir al area de vacantes, seleccionar al puesto que deseas aplicar, rellenar el formulario con los datos solicitados y enviarlo! Te estaremos dando respuesta en breve...'
        },
        {
            id:4, 
            titulo: '¿Como puedo aplicar a una vacante?',
            texto: 'Para aplicar a una vacante debes ir al area de vacantes, seleccionar al puesto que deseas aplicar, rellenar el formulario con los datos solicitados y enviarlo! Te estaremos dando respuesta en breve...'
        }
    ]

    return(
        
        <div className={styles.container}>
            <section className={styles.containerContact}>
                <div className={styles.titles}>
                    <h1>Contáctanos</h1>
                    <p>Estamos aqui para ayudarte</p>
                </div>
                    <div className={styles.containerForm}>
                    <LoginContacto />
                        <div className={styles.cardsContainer}>
                            {
                            cardsDataInfo.map(card => (
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
        </div>
    )
}