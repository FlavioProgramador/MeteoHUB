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
        <div className={styles.listItem}>
          <div className={`${styles.iconBox} ${styles.tealBox}`}>
            <Droplet size={20} className={styles.tealIcon} />
          </div>
          <div className={styles.listText}>
            <span className={styles.label}>Umidade</span>
            <span className={styles.value}>{weather.main.humidity}%</span>
          </div>
        </div>

        <div className={styles.listItem}>
          <div className={`${styles.iconBox} ${styles.orangeBox}`}>
            <Wind size={20} className={styles.orangeIcon} />
          </div>
          <div className={styles.listText}>
            <span className={styles.label}>Vento</span>
            <span className={styles.value}>{weather.wind.speed} km/h</span>
          </div>
        </div>

        <div className={styles.listItem}>
          <div className={`${styles.iconBox} ${styles.blueBox}`}>
            <Compass size={20} className={styles.blueIcon} />
          </div>
          <div className={styles.listText}>
            <span className={styles.label}>Direção do Ventos</span>
            <span className={styles.value}>{windDirection}</span>
          </div>
        </div>

        <div className={styles.listItem}>
          <div className={`${styles.iconBox} ${styles.redBox}`}>
            <Thermometer size={20} className={styles.redIcon} />
          </div>
          <div className={styles.listText}>
            <span className={styles.label}>Sensação Térmica</span>
            <span className={styles.value}>
              {Math.round(weather.main.feels_like)}°C
            </span>
          </div>
        </div>
      </div>

      <div className={styles.cardsSection}>
        <div className={styles.miniCard}>
          <div className={styles.miniCardHeader}>
            <Sun size={18} className={styles.yellowIcon} />
            <span className={styles.label}>Máxima</span>
          </div>
          <span className={styles.value}>
            {Math.round(weather.main.temp_max)}°C
          </span>
        </div>

        <div className={styles.miniCard}>
          <div className={styles.miniCardHeader}>
            <Moon size={18} className={styles.indigoIcon} />
            <span className={styles.label}>Mínima</span>
          </div>
          <span className={styles.value}>
            {Math.round(weather.main.temp_min)}°C
          </span>
        </div>

        <div className={styles.miniCard}>
          <div className={styles.miniCardHeader}>
            <CloudRain size={18} className={styles.lightBlueIcon} />
            <span className={styles.label}>Chuva</span>
          </div>
          <span className={styles.value}>
            {weather.rain?.["1h"] ? `${weather.rain["1h"]}%` : "0%"}
          </span>
        </div>

        <div className={styles.miniCard}>
          <div className={styles.miniCardHeader}>
            <Gauge size={18} className={styles.greenIcon} />
            <span className={styles.label}>Pressão</span>
          </div>
          <span className={styles.value}>{weather.main.pressure} hPa</span>
        </div>
      </div>
    </main>
  );
};

export default MainCard;
