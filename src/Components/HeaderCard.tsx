import type { WeatherData } from "../Types/weather";
import styles from "./HeaderCard.module.css";

interface HeaderCardProps {
  weather: WeatherData;
}

const HeaderCard = ({ weather }: HeaderCardProps) => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('pt-BR', options);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h2 className={styles.cityName}>{weather.name}</h2>
        <p className={styles.country}>{weather.sys.country}</p>
        <p className={styles.date}>{formattedDate}</p>
      </div>
      <div className={styles.headerRight}>
        <h1 className={styles.temperature}>{Math.round(weather.main.temp)}°C</h1>
        <p className={styles.condition}>{weather.weather[0].description}</p>
      </div>
    </header>
  );
};

export default HeaderCard;
