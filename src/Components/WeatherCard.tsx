import type { WeatherData } from "../Types/weather";
import HeaderCard from "./HeaderCard";
import MainCard from "./MainCard";
import FooterCard from "./FooterCard";
import styles from "./WeatherCard.module.css";

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard = ({ weather }: WeatherCardProps) => {
  return (
    <div className={styles.cardContainer}>
      <HeaderCard weather={weather} />
      <MainCard weather={weather} />
      <FooterCard />
    </div>
  );
};

export default WeatherCard;
