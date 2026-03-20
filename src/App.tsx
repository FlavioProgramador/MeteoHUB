import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import type { WeatherData } from "./Types/weather";
import { getWeatherByAPI, getWeatherByCoordinates, getForecastByAPI, getForecastByCoordinates, getCitySuggestions } from "./Services/api";
import type { ForecastData } from "./Types/forecast";
import type { CitySuggestion } from "./Types/geocoding";
import WeatherCard from "./Components/WeatherCard/WeatherCard";
import TemperatureChart from "./Components/TemperatureChart/TemperatureChart";
import EmptyState from "./Components/EmptyState/EmptyState";
import { WeatherAlert } from "./Components/WeatherAlert/WeatherAlert";
import { WeatherBackground } from "./Components/WeatherBackground/WeatherBackground";
import { SearchHistory } from "./Components/SearchHistory/SearchHistory";
import { useSearchHistory } from "./Hooks/useSearchHistory";
import { FavoriteCities } from "./Components/FavoriteCities/FavoriteCities";
import { useFavorites } from "./Hooks/useFavorites";
import { Search, Moon, Sun, CloudSun, Star } from "lucide-react";

function App() {
  
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const skipNextSuggestion = useRef(false);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();


  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

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
    
    const refetch = async () => {
      setLoading(true);
      try {
        const data = await getWeatherByCoordinates(weather.coord.lat, weather.coord.lon, unit);
        const forecastData = await getForecastByCoordinates(weather.coord.lat, weather.coord.lon, unit);
        setWeather(data);
        setForecast(forecastData);
      } catch (err) {
        console.error("Erro ao fazer refetch por mudança de unidade:", err);
      } finally {
        setLoading(false);
      }
    };
    
    refetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  useEffect(() => {
    if (skipNextSuggestion.current) {
      skipNextSuggestion.current = false;
      return;
    }
    if (city.trim().length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        const data = await getCitySuggestions(city);
        setSuggestions(data);
        setShowSuggestions(true);
      }, 600);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [city]);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowSuggestions(false);
    setShowSuggestions(false);

    const formData = new FormData(e.currentTarget);
    const cidadeDigitada = formData.get("city") as string;

    if (!cidadeDigitada) return;
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByAPI(cidadeDigitada, unit);
      const forecastData = await getForecastByAPI(cidadeDigitada, unit);
      setWeather(data);
      setForecast(forecastData);
      addToHistory(data.name);
    } catch (err) {
      setError("Erro ao buscar dados da API. Tem certeza de que a cidade " + cidadeDigitada + " existe?");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSuggestionClick(sug: CitySuggestion) {
    setShowSuggestions(false);
    setSuggestions([]);
    skipNextSuggestion.current = true;
    setCity(sug.name);
    
    if (!sug.lat || !sug.lon) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCoordinates(sug.lat, sug.lon, unit);
      const forecastData = await getForecastByCoordinates(sug.lat, sug.lon, unit);
      setWeather(data);
      setForecast(forecastData);
      addToHistory(data.name);
    } catch (err) {
      setError("Erro ao buscar dados precisos da cidade selecionada.");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLocation() {
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada por este navegador.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getWeatherByCoordinates(latitude, longitude, unit);
          const forecastData = await getForecastByCoordinates(latitude, longitude, unit);
          setWeather(data);
          setForecast(forecastData);
          addToHistory(data.name);
          skipNextSuggestion.current = true;
          setCity(data.name); 
        } catch (err) {
          setError("Erro ao buscar dados de clima da sua localização atual.");
          setWeather(null);
          setForecast(null);
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setError("Não foi possível acessar a localização. O usuário recusou o acesso ou ocorreu um erro.");
        setLoading(false);
      }
    );
  }

  return (
    <div className="app-container">
      {weather && (
        <WeatherBackground condition={weather.weather[0].main} />
      )}
      <div className="logoContainer">
        <CloudSun size={64} className="logoIcon" />
        <h1 className="logoText">MeteoHub</h1>
      </div>

      <div className="searchContainer">
        <div className="searchRow">
          <form className="searchForm" onSubmit={handleSearch}>
            <div className="searchWrapper">
              <input
                className="searchInput"
                type="text"
                name="city"
                placeholder="Digite o nome da cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestionsList">
                  {suggestions.map((sug, i) => (
                    <li key={i} onClick={() => handleSuggestionClick(sug)}>
                      {sug.name}{sug.state ? `, ${sug.state}` : ''} - {sug.country}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button className="searchIconBtn" type="submit" disabled={loading} aria-label="Buscar">
              <Search size={22} className="searchIconBlue" />
            </button>
          </form>

          <button className="locationBtn" type="button" onClick={handleLocation} disabled={loading}>
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
          onSelect={async (favCity: string) => {
            skipNextSuggestion.current = true;
            setCity(favCity);
            setLoading(true);
            setError(null);
            try {
              const data = await getWeatherByAPI(favCity, unit);
              const forecastData = await getForecastByAPI(favCity, unit);
              setWeather(data);
              setForecast(forecastData);
            } catch {
              setError("Erro ao buscar dados de " + favCity);
            } finally {
              setLoading(false);
            }
          }}
          onRemove={removeFavorite}
        />

        <SearchHistory
          history={history}
          onSelect={async (histCity) => {
            skipNextSuggestion.current = true;
            setCity(histCity);
            setLoading(true);
            setError(null);
            try {
              const data = await getWeatherByAPI(histCity, unit);
              const forecastData = await getForecastByAPI(histCity, unit);
              setWeather(data);
              setForecast(forecastData);
              addToHistory(data.name);
            } catch {
              setError("Erro ao buscar dados de " + histCity);
            } finally {
              setLoading(false);
            }
          }}
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

      <div className="bottomActions">
        <button className="themeToggle" onClick={toggleTheme} aria-label="Alterar Tema">
          {theme === "light" ? (
            <Moon size={22} className="themeToggleIcon" />
          ) : (
            <Sun size={22} className="themeToggleIcon" style={{ color: "#fbbf24" }} />
          )}
        </button>
      </div>
    </div>
  );
}

export default App;
