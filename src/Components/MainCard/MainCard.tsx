import type { WeatherData } from "../../Types/weather";
import styles from "./MainCard.module.css";
import { WeatherListSection } from "./WeatherListSection";
import { WeatherGridSection } from "./WeatherGridSection";

interface MainCardProps {
  weather: WeatherData;
}

const MainCard = ({ weather }: MainCardProps) => {
  return (
    <main className={styles.mainContainer}>
      <WeatherListSection weather={weather} />
      <WeatherGridSection weather={weather} />
    </main>
  );
};

export default MainCard;
