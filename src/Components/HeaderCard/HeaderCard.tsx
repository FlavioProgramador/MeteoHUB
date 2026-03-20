import type { WeatherData } from "../../Types/weather";
import styles from "./HeaderCard.module.css";

interface HeaderCardProps {
  weather: WeatherData;
  unit: "metric" | "imperial";
  onToggleUnit: () => void;
}

const HeaderCard = ({ weather, unit, onToggleUnit }: HeaderCardProps) => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("pt-BR", options);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h2 className={styles.cityName}>{weather.name}</h2>
        <p className={styles.country}>{weather.sys.country}</p>
        <p className={styles.date}>{formattedDate}</p>
      </div>
      <div className={styles.headerRight}>
        <h1 className={styles.temperature}>
          {Math.round(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
        </h1>
        <div className={styles.conditionRow}>
          <button 
            className={styles.unitToggleSmall} 
            onClick={onToggleUnit} 
            aria-label="Alternar Unidade"
          >
            ºC / ºF
          </button>
          <p className={styles.condition}>{weather.weather[0].description}</p>
        </div>
      </div>
    </header>
  );
};

export default HeaderCard;
