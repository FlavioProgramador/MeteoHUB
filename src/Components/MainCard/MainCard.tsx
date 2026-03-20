import type { WeatherData } from "../../Types/weather";
import {
  Droplet,
  Wind,
  Compass,
  Thermometer,
  Sun,
  Moon,
  CloudRain,
  Gauge,
} from "lucide-react";
import styles from "./MainCard.module.css";
import { WeatherListItem } from "./WeatherListItem";
import { WeatherGridItem } from "./WeatherGridItem";

interface MainCardProps {
  weather: WeatherData;
}

const MainCard = ({ weather }: MainCardProps) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const directionIndex = Math.round(weather.wind.deg / 45) % 8;
  const windDirection = directions[directionIndex];

  return (
    <main className={styles.mainContainer}>
      <div className={styles.listSection}>
        <WeatherListItem
          icon={Droplet}
          colorClass="teal"
          label="Umidade"
          value={`${weather.main.humidity}%`}
        />
        <WeatherListItem
          icon={Wind}
          colorClass="orange"
          label="Vento"
          value={`${weather.wind.speed} km/h`}
        />
        <WeatherListItem
          icon={Compass}
          colorClass="blue"
          label="Direção dos Ventos"
          value={windDirection}
        />
        <WeatherListItem
          icon={Thermometer}
          colorClass="red"
          label="Sensação Térmica"
          value={`${Math.round(weather.main.feels_like)}°C`}
        />
      </div>

      <div className={styles.cardsSection}>
        <WeatherGridItem
          icon={Sun}
          colorClass="yellow"
          label="Máxima"
          value={`${Math.round(weather.main.temp_max)}°C`}
        />
        <WeatherGridItem
          icon={Moon}
          colorClass="indigo"
          label="Mínima"
          value={`${Math.round(weather.main.temp_min)}°C`}
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
    </main>
  );
};

export default MainCard;
