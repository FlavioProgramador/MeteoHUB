import { useState } from "react";
import type { WeatherData, AirPollutionData, UVIndexData } from "../../Types/weather";
import type { ForecastData } from "../../Types/forecast";
import type { ExtendedForecastData } from "../../Types/extendedForecast";
import { WeatherAlert } from "../WeatherAlert/WeatherAlert";
import WeatherCard from "../WeatherCard/WeatherCard";
import TemperatureChart from "../TemperatureChart/TemperatureChart";
import { AirQualityCard } from "../AirQualityCard/AirQualityCard";
import { UVIndexCard } from "../UVIndexCard/UVIndexCard";
import { SunArcCard } from "../SunArcCard/SunArcCard";
import { MoonPhaseCard } from "../MoonPhaseCard/MoonPhaseCard";
import { WeatherRadar } from "../WeatherRadar/WeatherRadar";
import EmptyState from "../EmptyState/EmptyState";
import ExtendedForecastCard from "../ExtendedForecastCard/ExtendedForecastCard";
import TemperatureTrendChart from "../TemperatureTrendChart/TemperatureTrendChart";
import RainProbabilityCard from "../RainProbabilityCard/RainProbabilityCard";
import styles from "./WeatherDashboard.module.css";
import { motion, AnimatePresence } from "framer-motion";

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
  extendedForecast: ExtendedForecastData | null;
  unit: "metric" | "imperial";
  loading: boolean;
  error: string | null;
  onToggleUnit: () => void;
}

type TabType = "hoje" | "previsao";

export function WeatherDashboard({
  weather,
  forecast,
  airPollution,
  uvIndex,
  extendedForecast,
  unit,
  loading,
  error,
  onToggleUnit,
}: WeatherDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("hoje");

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (weather || forecast || airPollution || uvIndex) {
    return (
      <div className={styles.dashboardWrapper}>
        {weather && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <WeatherAlert weather={weather} unit={unit} />
          </motion.div>
        )}
        
        {weather && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <WeatherCard
              weather={weather}
              unit={unit}
              onToggleUnit={onToggleUnit}
            />
          </motion.div>
        )}

        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tabButton} ${activeTab === "hoje" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("hoje")}
          >
            Detalhes de Hoje
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === "previsao" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("previsao")}
          >
            Previsão Estendida
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.cardsContainer}
          >
            {activeTab === "hoje" && (
              <motion.div 
                className={styles.tabContent}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {forecast && (
                  <motion.div variants={itemVariants}>
                    <TemperatureChart data={forecast.list} unit={unit} />
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
              </motion.div>
            )}

            {activeTab === "previsao" && (
              <motion.div 
                className={styles.tabContent}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {extendedForecast && (
                  <motion.div variants={itemVariants}>
                    <ExtendedForecastCard forecast={extendedForecast} unit={unit} />
                  </motion.div>
                )}

                {extendedForecast && (
                  <motion.div variants={itemVariants}>
                    <TemperatureTrendChart forecast={extendedForecast} unit={unit} />
                  </motion.div>
                )}

                {extendedForecast && (
                  <motion.div variants={itemVariants}>
                    <RainProbabilityCard forecast={extendedForecast} />
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (!loading && !error) {
    return <EmptyState />;
  }

  return null;
}
