import type { WeatherData } from "../../Types/weather";
import HeaderCard from "../HeaderCard/HeaderCard";
import MainCard from "../MainCard/MainCard";
import FooterCard from "../FooterCard/FooterCard";
import styles from "./WeatherCard.module.css";

interface WeatherCardProps {
  weather: WeatherData;
  unit: "metric" | "imperial";
  onToggleUnit: () => void;
}

const WeatherCard = ({ weather, unit, onToggleUnit }: WeatherCardProps) => {
  return (
    <div className={styles.cardContainer}>
      <HeaderCard weather={weather} unit={unit} onToggleUnit={onToggleUnit} />
      <MainCard weather={weather} unit={unit} />
      <FooterCard />
    </div>
  );
};

export default WeatherCard;
