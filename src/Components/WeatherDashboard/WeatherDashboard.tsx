import type { WeatherData } from "../../Types/weather";
import type { ForecastData } from "../../Types/forecast";
import { WeatherAlert } from "../WeatherAlert/WeatherAlert";
import WeatherCard from "../WeatherCard/WeatherCard";
import TemperatureChart from "../TemperatureChart/TemperatureChart";
import EmptyState from "../EmptyState/EmptyState";

interface WeatherDashboardProps {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  unit: "metric" | "imperial";
  loading: boolean;
  error: string | null;
  onToggleUnit: () => void;
}

export function WeatherDashboard({
  weather,
  forecast,
  unit,
  loading,
  error,
  onToggleUnit,
}: WeatherDashboardProps) {
  if (error) {
    return <div className="error">{error}</div>;
  }

  if (weather || forecast) {
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
        {forecast && <TemperatureChart data={forecast.list} unit={unit} />}
      </div>
    );
  }

  if (!loading && !error) {
    return <EmptyState />;
  }

  return null;
}
