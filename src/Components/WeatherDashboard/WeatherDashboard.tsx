import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ExtendedForecastData } from "../../Types/extendedForecast";
import type { ForecastData } from "../../Types/forecast";
import type {
  AirPollutionData,
  UVIndexData,
  WeatherData,
} from "../../Types/weather";
import { AirQualityCard } from "../AirQualityCard/AirQualityCard";
import EmptyState from "../EmptyState/EmptyState";
import ExtendedForecastCard from "../ExtendedForecastCard/ExtendedForecastCard";
import { MoonPhaseCard } from "../MoonPhaseCard/MoonPhaseCard";
import RainProbabilityCard from "../RainProbabilityCard/RainProbabilityCard";
import { SunArcCard } from "../SunArcCard/SunArcCard";
import TemperatureChart from "../TemperatureChart/TemperatureChart";
import TemperatureTrendChart from "../TemperatureTrendChart/TemperatureTrendChart";
import { UVIndexCard } from "../UVIndexCard/UVIndexCard";
import { WeatherAlert } from "../WeatherAlert/WeatherAlert";
import WeatherCard from "../WeatherCard/WeatherCard";
import { WeatherRadar } from "../WeatherRadar/WeatherRadar";
import { WeatherDetailsGrid } from "./WeatherDetailsGrid";
import styles from "./WeatherDashboard.module.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
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
  onSearch?: (city: string) => void;
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
  onSearch,
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
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

                <motion.div variants={itemVariants}>
                  <WeatherDetailsGrid
                    weather={weather}
                    uvIndex={uvIndex}
                    airPollution={airPollution}
                    styles={styles}
                  />
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
                    <ExtendedForecastCard
                      forecast={extendedForecast}
                      unit={unit}
                    />
                  </motion.div>
                )}

                {extendedForecast && (
                  <motion.div variants={itemVariants}>
                    <TemperatureTrendChart
                      forecast={extendedForecast}
                      unit={unit}
                    />
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
    return <EmptyState onSearch={onSearch} />;
  }

  return null;
}
