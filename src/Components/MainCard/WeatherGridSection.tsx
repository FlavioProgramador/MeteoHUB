import type { WeatherData } from "../../Types/weather";
import { Sun, Moon, CloudRain, Gauge } from "lucide-react";
import styles from "./MainCard.module.css";
import { WeatherGridItem } from "./WeatherGridItem";

interface WeatherGridSectionProps {
  weather: WeatherData;
  unit: "metric" | "imperial";
}

export const WeatherGridSection = ({ weather, unit }: WeatherGridSectionProps) => {
  return (
    <div className={styles.cardsSection}>
      <WeatherGridItem
        icon={Sun}
        colorClass="yellow"
        label="Máxima"
        value={`${Math.round(weather.main.temp_max)}°${unit === 'metric' ? 'C' : 'F'}`}
      />
      <WeatherGridItem
        icon={Moon}
        colorClass="indigo"
        label="Mínima"
        value={`${Math.round(weather.main.temp_min)}°${unit === 'metric' ? 'C' : 'F'}`}
      />
      <WeatherGridItem
        icon={CloudRain}
        colorClass="lightBlue"
        label="Chuva"
        value={weather.rain?.["1h"] ? `${weather.rain["1h"]}%` : "0%"}
      />
      <WeatherGridItem
        icon={Gauge}
        colorClass="green"
        label="Pressão"
        value={`${weather.main.pressure} hPa`}
      />
    </div>
  );
};
