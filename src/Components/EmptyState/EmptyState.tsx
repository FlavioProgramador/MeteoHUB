import { Map, CloudSun, Compass } from "lucide-react";
import styles from "./EmptyState.module.css";

const EmptyState = () => {
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.illustrationWrapper}>
        <div className={styles.pulseRing}></div>
        <div className={styles.iconCircle}>
          <Map size={48} className={styles.mainIcon} />
        </div>
        <CloudSun size={32} className={`${styles.floatingIcon} ${styles.floatRight}`} />
        <Compass size={28} className={`${styles.floatingIcon} ${styles.floatLeft}`} />
      </div>

      <div className={styles.textContent}>
        <h2 className={styles.title}>Explore o clima global</h2>
        <p className={styles.subtitle}>
          Busque por qualquer cidade ou use sua localização para descobrir previsões precisas, umidade, ventos e muito mais em milissegundos.
        </p>
      </div>

      <div className={styles.featuresContainer}>
        <div className={styles.featureItem}>
          <div className={styles.featureDot} />
          <span>Tempo Real</span>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureDot} />
          <span>Previsões</span>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureDot} />
          <span>Métricas</span>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
