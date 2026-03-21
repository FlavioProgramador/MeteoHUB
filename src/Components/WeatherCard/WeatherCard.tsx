import type { WeatherData } from "../../Types/weather";
import HeaderCard from "../HeaderCard/HeaderCard";
import MainCard from "../MainCard/MainCard";
import FooterCard from "../FooterCard/FooterCard";
import styles from "./WeatherCard.module.css";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};

interface WeatherCardProps {
  weather: WeatherData;
  unit: "metric" | "imperial";
  onToggleUnit: () => void;
}

const WeatherCard = ({ weather, unit, onToggleUnit }: WeatherCardProps) => {
  return (
    <div className={styles.cardContainer}>
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
        style={{ display: "flex", flexDirection: "column", gap: "inherit" }}
      >
        <motion.div variants={itemVariants}>
          <HeaderCard weather={weather} unit={unit} onToggleUnit={onToggleUnit} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MainCard weather={weather} unit={unit} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FooterCard />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WeatherCard;
