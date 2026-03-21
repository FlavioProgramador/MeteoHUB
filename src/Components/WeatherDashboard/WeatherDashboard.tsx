import type { WeatherData, AirPollutionData, UVIndexData } from "../../Types/weather";
import type { ForecastData } from "../../Types/forecast";
import { WeatherAlert } from "../WeatherAlert/WeatherAlert";
import WeatherCard from "../WeatherCard/WeatherCard";
import TemperatureChart from "../TemperatureChart/TemperatureChart";
import { AirQualityCard } from "../AirQualityCard/AirQualityCard";
import { UVIndexCard } from "../UVIndexCard/UVIndexCard";
import { SunArcCard } from "../SunArcCard/SunArcCard";
import { MoonPhaseCard } from "../MoonPhaseCard/MoonPhaseCard";
import { WeatherRadar } from "../WeatherRadar/WeatherRadar";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./WeatherDashboard.module.css";
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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};

interface WeatherDashboardProps {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  airPollution: AirPollutionData | null;
  uvIndex: UVIndexData | null;
  unit: "metric" | "imperial";
  loading: boolean;
  error: string | null;
  onToggleUnit: () => void;
}

export function WeatherDashboard({
  weather,
  forecast,
  airPollution,
  uvIndex,
  unit,
  loading,
  error,
  onToggleUnit,
}: WeatherDashboardProps) {
  if (error) {
    return <div className="error">{error}</div>;
  }

  if (weather || forecast || airPollution || uvIndex) {
    return (
      <motion.div 
        className="cardsContainer"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {weather && (
          <motion.div variants={itemVariants}>
            <WeatherAlert weather={weather} unit={unit} />
          </motion.div>
        )}
        
        {weather && (
          <motion.div variants={itemVariants}>
            <WeatherCard
              weather={weather}
              unit={unit}
              onToggleUnit={onToggleUnit}
            />
          </motion.div>
        )}

        <motion.div className={styles.gridContainer} variants={itemVariants}>
          {weather && (
            <div className={styles.sunArcWrapper}>
              <SunArcCard weather={weather} />
            </div>
          )}
          
          <div className={styles.moonPhaseWrapper}>
            <MoonPhaseCard />
          </div>

          {uvIndex && (
            <div className={styles.uvIndexWrapper}>
              <UVIndexCard data={uvIndex} />
            </div>
          )}

          {airPollution && (
            <div className={styles.airQualityWrapper}>
              <AirQualityCard data={airPollution} />
            </div>
          )}
        </motion.div>
        
        {weather && (
          <motion.div variants={itemVariants}>
            <WeatherRadar weather={weather} />
          </motion.div>
        )}
        
        {forecast && (
          <motion.div variants={itemVariants}>
            <TemperatureChart data={forecast.list} unit={unit} />
          </motion.div>
        )}
      </motion.div>
    );
  }

  if (!loading && !error) {
    return <EmptyState />;
  }

  return null;
}
