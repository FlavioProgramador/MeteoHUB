import { useState, useEffect } from "react";
import "./App.css";
import WeatherCard from "./Components/WeatherCard/WeatherCard";
import TemperatureChart from "./Components/TemperatureChart/TemperatureChart";
import EmptyState from "./Components/EmptyState/EmptyState";

import { useWeather } from "./Hooks/useWeather";
import { useSearchHistory } from "./Hooks/useSearchHistory";
import { useFavorites } from "./Hooks/useFavorites";
import { useTheme } from "./Hooks/useTheme";
import { useGeolocation } from "./Hooks/useGeolocation";

import { Header } from "./Components/Header/Header";
import { SearchBar } from "./Components/SearchBar/SearchBar";
import { FavoriteCities } from "./Components/FavoriteCities/FavoriteCities";
import { SearchHistory } from "./Components/SearchHistory/SearchHistory";
import { ThemeToggle } from "./Components/ThemeToggle/ThemeToggle";
import { WeatherBackground } from "./Components/WeatherBackground/WeatherBackground";
import { WeatherDashboard } from "./Components/WeatherDashboard/WeatherDashboard";
import { LocationButton } from "./Components/Buttons/LocationButton";
import { FavoriteButton } from "./Components/Buttons/FavoriteButton";

function App() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [searchedCity, setSearchedCity] = useState("");

  useTheme(); // Inicializa o listener de tema do sistema

  const { handleLocation } = useGeolocation();

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { history, addToHistory, removeFromHistory, clearHistory } =
    useSearchHistory();

  const {
    weather,
    forecast,
    airPollution,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    setError,
  } = useWeather(unit);

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
    fetchWeatherByCoords(weather.coord.lat, weather.coord.lon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const handleSearchSuccess = (cityName: string) => {
    setSearchedCity("");
    addToHistory(cityName);
  };

  const onLocationClick = () => {
    handleLocation({
      onSuccess: (lat, lon) =>
        fetchWeatherByCoords(lat, lon, handleSearchSuccess),
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

      <div className="searchContainer">
        <div className="searchRow">
          <SearchBar
            searchedCity={searchedCity}
            loading={loading}
            onSearch={(city: string) => fetchWeatherByCity(city, handleSearchSuccess)}
            onSuggestionClick={(lat: number, lon: number) =>
              fetchWeatherByCoords(lat, lon, handleSearchSuccess)
            }
          />

          <LocationButton loading={loading} onClick={onLocationClick} />

          {weather && (
            <FavoriteButton
              isFavorite={isFavorite(weather.name)}
              onToggle={() =>
                isFavorite(weather.name)
                  ? removeFavorite(weather.name)
                  : addFavorite(weather.name)
              }
            />
          )}
        </div>

        <FavoriteCities
          favorites={favorites}
          currentCity={weather?.name ?? ""}
          onSelect={(favCity: string) =>
            fetchWeatherByCity(favCity, handleSearchSuccess)
          }
          onRemove={removeFavorite}
        />

        <SearchHistory
          history={history}
          onSelect={(histCity: string) =>
            fetchWeatherByCity(histCity, handleSearchSuccess)
          }
          onRemove={removeFromHistory}
          onClear={clearHistory}
        />
      </div>

      <WeatherDashboard
        weather={weather}
        forecast={forecast}
        airPollution={airPollution}
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
