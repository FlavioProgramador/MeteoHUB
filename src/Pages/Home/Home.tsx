import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

import { useAuth } from "../../Contexts/AuthContext";
import { useExtendedForecast } from "../../Hooks/useExtendedForecast";
import { useFavorites } from "../../Hooks/useFavorites";
import { useSearchHistory } from "../../Hooks/useSearchHistory";
import { useTheme } from "../../Hooks/useTheme";
import { useWeather } from "../../Hooks/useWeather";
import { useUpdateWeatherBackground } from "../../Hooks/useUpdateWeatherBackground";
import {
  handleGeolocation,
  type GeolocationCallbacks,
} from "../../Utils/geolocation";

import { SearchPanel } from "../../Components/SearchPanel/SearchPanel";
import { ThemeToggle } from "../../Components/ThemeToggle/ThemeToggle";
import { WeatherBackground } from "../../Components/WeatherBackground/WeatherBackground";
import { WeatherDashboard } from "../../Components/WeatherDashboard/WeatherDashboard";

export function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [searchedCity, setSearchedCity] = useState("");

  useTheme();

  const handleLocation = (callbacks: GeolocationCallbacks) => {
    handleGeolocation(callbacks);
  };

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { history, addToHistory, removeFromHistory, clearHistory } =
    useSearchHistory();

  const {
    weather,
    forecast,
    airPollution,
    uvIndex,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    setError,
  } = useWeather(unit);

  const { extendedForecast, fetchExtendedForecast } = useExtendedForecast(unit);

  useUpdateWeatherBackground(weather);

  useEffect(() => {
    if (!weather?.coord) return;
    fetchExtendedForecast(weather.coord.lat, weather.coord.lon, weather.name);
  }, [
    unit,
    weather?.coord,
    weather?.name,
    fetchExtendedForecast,
  ]);

  const handleSearchSuccess = (cityName: string) => {
    setSearchedCity("");
    addToHistory(cityName);
  };

  const handleCitySearch = (city: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchWeatherByCity(city, handleSearchSuccess);
  };

  const handleCoordsSearch = (lat: number, lon: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchWeatherByCoords(lat, lon, handleSearchSuccess);
  };

  const onLocationClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    handleLocation({
      onSuccess: handleCoordsSearch,
      onError: setError,
    });
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
    if (weather) {
      fetchWeatherByCity(weather.name);
    }
  };

  return (
    <div className="app-container">
      {weather && isAuthenticated && (
        <WeatherBackground condition={weather.weather[0].main} />
      )}

      <SearchPanel
        searchedCity={searchedCity}
        loading={loading}
        weatherName={weather?.name}
        favorites={favorites}
        history={history}
        isFavorite={isFavorite}
        onSearch={handleCitySearch}
        onSuggestionClick={handleCoordsSearch}
        onLocationClick={onLocationClick}
        onToggleFavorite={(city: string) => {
          if (!isAuthenticated) {
            navigate("/login");
            return;
          }
          if (isFavorite(city)) {
            removeFavorite(city);
          } else {
            addFavorite(city);
          }
        }}
        onSelectCity={handleCitySearch}
        onRemoveFavorite={removeFavorite}
        onRemoveHistory={removeFromHistory}
        onClearHistory={clearHistory}
      />

      <WeatherDashboard
        weather={isAuthenticated ? weather : null}
        forecast={isAuthenticated ? forecast : null}
        airPollution={isAuthenticated ? airPollution : null}
        uvIndex={isAuthenticated ? uvIndex : null}
        extendedForecast={isAuthenticated ? extendedForecast : null}
        unit={unit}
        loading={loading}
        error={error}
        onToggleUnit={handleToggleUnit}
        onSearch={handleCitySearch}
      />

      <div className="bottomActions">
        <ThemeToggle />
      </div>
    </div>
  );
}
