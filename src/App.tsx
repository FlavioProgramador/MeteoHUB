import React, { useEffect, useState } from "react";
import "./App.css";
import WeatherCard from "./Components/WeatherCard/WeatherCard";
import TemperatureChart from "./Components/TemperatureChart/TemperatureChart";
import EmptyState from "./Components/EmptyState/EmptyState";
import { WeatherAlert } from "./Components/WeatherAlert/WeatherAlert";
import { WeatherBackground } from "./Components/WeatherBackground/WeatherBackground";
import { SearchHistory } from "./Components/SearchHistory/SearchHistory";
import { useSearchHistory } from "./Hooks/useSearchHistory";
import { FavoriteCities } from "./Components/FavoriteCities/FavoriteCities";
import { useFavorites } from "./Hooks/useFavorites";
import { SearchBar } from "./Components/SearchBar/SearchBar";
import { useWeather } from "./Hooks/useWeather";
import { Star } from "lucide-react";
import { Header } from "./Components/Header/Header";
import { ThemeToggle } from "./Components/ThemeToggle/ThemeToggle";
import { useTheme } from "./Hooks/useTheme";
import { useGeolocation } from "./Hooks/useGeolocation";

function App() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [searchedCity, setSearchedCity] = useState("");

  useTheme(); // Inicializa o listener de tema do sistema
  const { handleLocation } = useGeolocation();

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  
  const { 
    weather, 
    forecast, 
    loading, 
    error, 
    fetchWeatherByCity, 
    fetchWeatherByCoords,
    setError 
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
    setSearchedCity(cityName);
    addToHistory(cityName);
  };

  const onLocationClick = () => {
    handleLocation({
      onSuccess: (lat, lon) => fetchWeatherByCoords(lat, lon, handleSearchSuccess),
      onError: setError
    });
  };

  return (
    <div className="app-container">
      {weather && (
        <WeatherBackground condition={weather.weather[0].main} />
      )}
      
      <Header />

      <div className="searchContainer">
        <div className="searchRow">
          <SearchBar 
            searchedCity={searchedCity}
            loading={loading}
            onSearch={(city) => fetchWeatherByCity(city, handleSearchSuccess)}
            onSuggestionClick={(lat, lon, name) => fetchWeatherByCoords(lat, lon, handleSearchSuccess)}
          />

          <button className="locationBtn" type="button" onClick={onLocationClick} disabled={loading}>
            {loading ? "Buscando..." : "Usar Localização"}
          </button>

          {weather && (
            <button
              className={`favIconBtn ${isFavorite(weather.name) ? "favIconActive" : ""}`}
              type="button"
              onClick={() =>
                isFavorite(weather.name)
                  ? removeFavorite(weather.name)
                  : addFavorite(weather.name)
              }
              aria-label={isFavorite(weather.name) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              title={isFavorite(weather.name) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Star
                size={22}
                style={{
                  fill: isFavorite(weather.name) ? "#fbbf24" : "none",
                  color: isFavorite(weather.name) ? "#fbbf24" : "currentColor",
                  transition: "all 0.2s",
                }}
              />
            </button>
          )}
        </div>

        <FavoriteCities
          favorites={favorites}
          currentCity={weather?.name ?? ""}
          onSelect={(favCity: string) => fetchWeatherByCity(favCity, handleSearchSuccess)}
          onRemove={removeFavorite}
        />

        <SearchHistory
          history={history}
          onSelect={(histCity: string) => fetchWeatherByCity(histCity, handleSearchSuccess)}
          onRemove={removeFromHistory}
          onClear={clearHistory}
        />
      </div>

      {error && <p className="errorMessage">{error}</p>}

      {weather || forecast ? (
        <div className="cardsContainer">
          {weather && <WeatherAlert weather={weather} unit={unit} />}
          {weather && <WeatherCard weather={weather} unit={unit} onToggleUnit={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')} />}
          {forecast && <TemperatureChart data={forecast.list} unit={unit} />}
        </div>
      ) : (
        <EmptyState />
      )}

      <ThemeToggle />
    </div>
  );
}

export default App;
