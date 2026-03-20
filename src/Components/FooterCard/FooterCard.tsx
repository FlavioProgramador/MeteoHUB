import styles from "./FooterCard.module.css";

const FooterCard = () => {
  return (
    <footer className={styles.footer}>
      <p>
        Dados fornecidos por <span className={styles.highlight}>OpenWeatherMap</span>
      </p>
    </footer>
  );
};

export default FooterCard;
