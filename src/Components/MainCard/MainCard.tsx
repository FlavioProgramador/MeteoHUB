import type { WeatherData } from "../../Types/weather";
import styles from "./MainCard.module.css";
import { WeatherListSection } from "./WeatherListSection";
import { WeatherGridSection } from "./WeatherGridSection";

interface MainCardProps {
  weather: WeatherData;
  unit: "metric" | "imperial";
}

const MainCard = ({ weather, unit }: MainCardProps) => {
  return (
    <main className={styles.mainContainer}>
      <WeatherListSection weather={weather} unit={unit} />
      <WeatherGridSection weather={weather} unit={unit} />
    </main>
  );
};

export default MainCard;
