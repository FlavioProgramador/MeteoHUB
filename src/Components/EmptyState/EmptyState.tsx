import { Search } from "lucide-react";
import styles from "./EmptyState.module.css";

const EmptyState = () => {
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.iconWrapper}>
        <div className={styles.iconCircle}>
          <Search size={48} className={styles.searchIcon} />
        </div>
      </div>
      <h2 className={styles.title}>Encontre o clima de qualquer cidade</h2>
      <p className={styles.subtitle}>
        Digite o nome de uma cidade acima para ver as condições climáticas atuais, revisão e muito mais!
      </p>

      <div className={styles.pillsContainer}>
        <span className={styles.pill}>Tempo real</span>
        <span className={styles.pill}>Previsão</span>
        <span className={styles.pill}>Detalhes</span>
      </div>
    </div>
  );
};

export default EmptyState;
