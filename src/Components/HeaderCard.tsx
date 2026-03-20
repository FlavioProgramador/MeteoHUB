import type { WeatherData } from "../Types/weather";
import styles from "./HeaderCard.module.css";

interface HeaderCardProps {
  weather: WeatherData;
}

const HeaderCard = ({ weather }: HeaderCardProps) => {
  return (
    <header className={styles.header}>
      <h2 className={styles.cityName}>{weather.name}</h2>
      <h1 className={styles.temperature}>{Math.round(weather.main.temp)}°C</h1>
      <p className={styles.condition}>{weather.weather[0].description}</p>
    </header>
  );
};

export default HeaderCard;
