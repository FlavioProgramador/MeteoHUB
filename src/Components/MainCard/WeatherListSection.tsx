import type { WeatherData } from "../../Types/weather";
import { Droplet, Wind, Compass, Thermometer } from "lucide-react";
import styles from "./MainCard.module.css";
import { WeatherListItem } from "./WeatherListItem";

interface WeatherListSectionProps {
  weather: WeatherData;
}

export const WeatherListSection = ({ weather }: WeatherListSectionProps) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const directionIndex = Math.round(weather.wind.deg / 45) % 8;
  const windDirection = directions[directionIndex];

  return (
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
  );
};
