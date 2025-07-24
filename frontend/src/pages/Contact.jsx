import styles from "../styles/Contact.module.scss";
import { FormContacto } from "../components/FormContacto/FormContacto";
import { CardsContacto } from "../components/CardsContacto/CardsContacto";
import { CardsPreguntas } from "../components/CardsPreguntas/CardsPreguntas";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const Contact = () => {
  const cardsDataInfo = [
    {
      id: 1,
      titulo: "Teléfono",
      imageUrl: <Phone color="#ff8500" />,
      parrafo: "+58(212)9518337",
      parrafo2: "+58(412)3704956",
    },
    {
      id: 2,
      titulo: "Correo Electrónico",
      imageUrl: <Mail color="#ff8500" />,
      parrafo: "info@novumideas.com",
      parrafo2: "rrhh@novumideas.com",
    },
    {
      id: 3,
      titulo: "Ubicación",
      imageUrl: <MapPin color="#ff8500" />,
      parrafo: "Torre Orinoco, Av. La guairita",
      parrafo2: "Caracas, Distrito Capital",
    },
    {
      id: 4,
      titulo: "Horario",
      imageUrl: <Clock color="#ff8500" />,
      parrafo: "Lunes a Viernes: 8:00 - 5:00",
    },
  ];

  const cardsPreguntas = [
    {
      id: 1,
      titulo: "¿Como puedo aplicar a una vacante?",
      texto:
        "Para aplicar a una vacante debes ir al area de vacantes, seleccionar al puesto que deseas aplicar, rellenar el formulario con los datos solicitados y enviarlo! Te estaremos dando respuesta en breve...",
    },
    {
      id: 2,
      titulo: "¿Cuánto tarda el proceso de captación?",
      texto:
        "El tiempo que tarda el proceso de captación puede variar dependiendo de la vacante específica y el volumen de postulaciones. Generalmente, nuestro equipo se esfuerza por revisar las solicitudes y contactar a los candidatos preseleccionados en un plazo de 1 a 2 semanas desde la fecha de postulación. Los procesos de entrevistas y evaluaciones subsiguientes se comunicarán a los candidatos a medida que avancen en el proceso.",
    },
    {
      id: 3,
      titulo: "¿Cómo es el proceso de captación?",
      texto:
        "Nuestra aplicación web facilita que los postulantes descubran y apliquen a oportunidades de forma ágil, permitiéndonos a nosotros gestionar eficientemente el proceso de captación a través de las interacciones directas con las vacantes publicadas.",
    },
    {
      id: 4,
      titulo: "¿Cómo puedo saber el estado de mi postulación?",
      texto:
        "Actualmente, nuestro equipo se pondrá en contacto contigo directamente si tu perfil es preseleccionado para avanzar en el proceso. Te recomendamos estar atento a tu correo electrónico y número de teléfono proporcionados en la postulación. Estamos trabajando para implementar una funcionalidad que te permita consultar el estado de tu postulación directamente en la plataforma en el futuro.",
    },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.containerContact}>
        <div className={styles.titles}>
          <h1>Contáctanos</h1>
          <p>Estamos aqui para ayudarte</p>
        </div>
        <div className={styles.containerForm}>
          <FormContacto />
          <div className={styles.cardsContainer}>
            {cardsDataInfo.map((card) => (
              <CardsContacto
                key={card.id}
                titulo={card.titulo}
                imageUrl={card.imageUrl}
                parrafo={card.parrafo}
                parrafo2={card.parrafo2}
              />
            ))}
          </div>
        </div>
        {/* Preguntas Frecuentes */}
        <section className={styles.cardsPreguntas}>
          <h2>Preguntas Frecuentes</h2>
          <div className={styles.cardsPreguntasContainer}>
            {cardsPreguntas.map((card) => (
              <CardsPreguntas
                key={card.id}
                titulo={card.titulo}
                texto={card.texto}
              />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
};
