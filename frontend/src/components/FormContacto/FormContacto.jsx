import styles from "./FormContacto.module.scss";

export const FormContacto = () => {
  return (
    <div className="h-full">
      <form className={styles.formContainer} action="">
        <div className={styles.titleContainer}>
          <h2 className={styles.titleForm}>Envianos un mensaje</h2>
          <p>Completa el formulario y te responderemos a la brevedad posible</p>
        </div>
        <label htmlFor="">Nombre Completo</label>
        <input className={styles.input} type="text" placeholder="Tu nombre" />
        <label htmlFor="">Correo Electronico</label>
        <input type="email" placeholder="Tu @email" />
        <label htmlFor="">Mensaje</label>
        <textarea
          className={styles.textarea}
          name=""
          id=""
          placeholder="¿En que podemos ayudarte?"
        ></textarea>
        <button type="submit">Enviar mensaje</button>
      </form>
    </div>
  );
};
