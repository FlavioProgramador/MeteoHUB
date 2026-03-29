import { CloudSun, CloudRain, Sun, Navigation, Globe2, MoveRight } from "lucide-react";
import styles from "./EmptyState.module.css";
import { motion } from "framer-motion";

interface EmptyStateProps {
  onSearch?: (city: string) => void;
}

const POPULAR_CITIES = [
  { name: "São Paulo", icon: <CloudRain size={20} /> },
  { name: "Rio de Janeiro", icon: <Sun size={20} color="#eab308" /> },
  { name: "Nova York", icon: <CloudSun size={20} /> },
  { name: "Tóquio", icon: <Sun size={20} color="#eab308" /> },
  { name: "Londres", icon: <CloudRain size={20} /> },
  { name: "Paris", icon: <CloudSun size={20} /> },
];

const EmptyState = ({ onSearch }: EmptyStateProps) => {
  return (
    <div className={styles.emptyContainer}>
      <motion.div 
        className={styles.heroSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.iconWrapper}>
          <Globe2 size={64} className={styles.heroIcon} />
        </div>
        <h2 className={styles.title}>
          Descubra o clima <br />
          <span className={styles.titleHighlight}>em qualquer lugar.</span>
        </h2>
        <p className={styles.subtitle}>
          Digite o nome de uma cidade acima ou acesse a sua localização para obter previsões precisas, alertas climáticos, mapas de radar e radar de satélite em tempo real.
        </p>
      </motion.div>

      <motion.div 
        className={styles.quickSearchSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className={styles.quickSearchHeader}>
          <h3>Cidades Populares</h3>
          <Navigation size={14} className={styles.navIcon} />
        </div>

        <div className={styles.citiesGrid}>
          {POPULAR_CITIES.map((city, index) => (
            <motion.button
              key={city.name}
              className={`glass-panel ${styles.cityCard}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (index * 0.05) }}
              onClick={() => onSearch && onSearch(city.name)}
            >
              <div className={styles.cityIcon}>{city.icon}</div>
              <span className={styles.cityName}>{city.name}</span>
              <MoveRight className={styles.arrowIcon} size={14} />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyState;
