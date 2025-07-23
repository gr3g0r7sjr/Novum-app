import styles from "./CardsMisionVision.module.scss";

export const CardsMisionVision = (props) => {
  const { icono, titulo, texto } = props;

  return (
    <div className={styles.card_Mision_Vision}>
      <div className={styles.mision}>
        {icono}
        <p>{titulo}</p>
      </div>
      <div className={styles.vision}>
        <p>{texto}</p>
      </div>
    </div>
  );
};
