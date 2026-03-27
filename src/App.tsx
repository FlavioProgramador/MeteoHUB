import { useState, useEffect } from "react";
import "./App.css";

import { useWeather } from "./Hooks/useWeather";
import { useSearchHistory } from "./Hooks/useSearchHistory";
import { useFavorites } from "./Hooks/useFavorites";
import { useTheme } from "./Hooks/useTheme";
import { useExtendedForecast } from "./Hooks/useExtendedForecast";
import { handleGeolocation, type GeolocationCallbacks } from "./Utils/geolocation";

import { Header } from "./Components/Header/Header";
import { SearchPanel } from "./Components/SearchPanel/SearchPanel";
import { ThemeToggle } from "./Components/ThemeToggle/ThemeToggle";
import { WeatherBackground } from "./Components/WeatherBackground/WeatherBackground";
import { WeatherDashboard } from "./Components/WeatherDashboard/WeatherDashboard";

function App() {
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

  const {
    extendedForecast,
    fetchExtendedForecast,
  } = useExtendedForecast(unit);

  useEffect(() => {
    if (weather && weather.weather && weather.weather.length > 0) {
      const condition = weather.weather[0].main.toLowerCase();
      document.documentElement.setAttribute("data-weather", condition);
    } else {
      document.documentElement.removeAttribute("data-weather");
    }
  }, [weather]);

  useEffect(() => {
    if (!weather?.coord) return;
    fetchExtendedForecast(weather.coord.lat, weather.coord.lon, weather.name);
  }, [unit, weather?.coord?.lat, weather?.coord?.lon, weather?.name, fetchExtendedForecast]);

  const handleSearchSuccess = (cityName: string) => {
    setSearchedCity("");
    addToHistory(cityName);
  };

  const handleCitySearch = (city: string) => {
    fetchWeatherByCity(city, handleSearchSuccess);
  };

  const handleCoordsSearch = (lat: number, lon: number) => {
    fetchWeatherByCoords(lat, lon, handleSearchSuccess);
  };

  const onLocationClick = () => {
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
      {weather && <WeatherBackground condition={weather.weather[0].main} />}

      <Header />

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
        onToggleFavorite={(city: string) =>
          isFavorite(city) ? removeFavorite(city) : addFavorite(city)
        }
        onSelectCity={handleCitySearch}
        onRemoveFavorite={removeFavorite}
        onRemoveHistory={removeFromHistory}
        onClearHistory={clearHistory}
      />

      <WeatherDashboard
        weather={weather}
        forecast={forecast}
        airPollution={airPollution}
        uvIndex={uvIndex}
        extendedForecast={extendedForecast}
        unit={unit}
        loading={loading}
        error={error}
        onToggleUnit={handleToggleUnit}
      />

      <div className="bottomActions">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default App;
