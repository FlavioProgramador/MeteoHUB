import type { WeatherData, AirPollutionData, UVIndexData } from "../../Types/weather";
import type { ForecastData } from "../../Types/forecast";
import { WeatherAlert } from "../WeatherAlert/WeatherAlert";
import WeatherCard from "../WeatherCard/WeatherCard";
import TemperatureChart from "../TemperatureChart/TemperatureChart";
import { AirQualityCard } from "../AirQualityCard/AirQualityCard";
import { UVIndexCard } from "../UVIndexCard/UVIndexCard";
import { SunArcCard } from "../SunArcCard/SunArcCard";
import { MoonPhaseCard } from "../MoonPhaseCard/MoonPhaseCard";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./WeatherDashboard.module.css";

interface WeatherDashboardProps {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  airPollution: AirPollutionData | null;
  uvIndex: UVIndexData | null;
  unit: "metric" | "imperial";
  loading: boolean;
  error: string | null;
  onToggleUnit: () => void;
}

export function WeatherDashboard({
  weather,
  forecast,
  airPollution,
  uvIndex,
  unit,
  loading,
  error,
  onToggleUnit,
}: WeatherDashboardProps) {
  if (error) {
    return <div className="error">{error}</div>;
  }

  if (weather || forecast || airPollution || uvIndex) {
    return (
      <div className="cardsContainer">
        {weather && <WeatherAlert weather={weather} unit={unit} />}
        {weather && (
          <WeatherCard
            weather={weather}
            unit={unit}
            onToggleUnit={onToggleUnit}
          />
        )}
        <div className={styles.gridContainer}>
          {weather && (
            <div className={styles.sunArcWrapper}>
              <SunArcCard weather={weather} />
            </div>
          )}
          
          <div className={styles.moonPhaseWrapper}>
            <MoonPhaseCard />
          </div>

          {uvIndex && (
            <div className={styles.uvIndexWrapper}>
              <UVIndexCard data={uvIndex} />
            </div>
          )}

          {airPollution && (
            <div className={styles.airQualityWrapper}>
              <AirQualityCard data={airPollution} />
            </div>
          )}
        </div>
        {forecast && <TemperatureChart data={forecast.list} unit={unit} />}
      </div>
    );
  }

  if (!loading && !error) {
    return <EmptyState />;
  }

  return null;
}
