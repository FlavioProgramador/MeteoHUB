import React, { useEffect, useState } from "react";
import "./App.css";
import type { WeatherData } from "./Types/weather";
import { getWeatherByAPI, getWeatherByCoordinates, getForecastByAPI, getForecastByCoordinates, getCitySuggestions } from "./Services/api";
import type { ForecastData } from "./Types/forecast";
import type { CitySuggestion } from "./Types/geocoding";
import WeatherCard from "./Components/WeatherCard/WeatherCard";
import TemperatureChart from "./Components/TemperatureChart/TemperatureChart";
import EmptyState from "./Components/EmptyState/EmptyState";
import { Search, Moon, Sun, CloudSun } from "lucide-react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  useEffect(() => {
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
      const data = await getWeatherByAPI(cidadeDigitada);
      const forecastData = await getForecastByAPI(cidadeDigitada);
      setWeather(data);
      setForecast(forecastData);
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
    setCity(sug.name);
    
    if (!sug.lat || !sug.lon) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCoordinates(sug.lat, sug.lon);
      const forecastData = await getForecastByCoordinates(sug.lat, sug.lon);
      setWeather(data);
      setForecast(forecastData);
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
          const data = await getWeatherByCoordinates(latitude, longitude);
          const forecastData = await getForecastByCoordinates(latitude, longitude);
          setWeather(data);
          setForecast(forecastData);
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
      <div className="logoContainer">
        <CloudSun size={64} className="logoIcon" />
        <h1 className="logoText">MeteoHub</h1>
      </div>

      <div className="searchContainer">
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
      </div>

      {error && <p className="errorMessage">{error}</p>}

      {weather || forecast ? (
        <div className="cardsContainer">
          {weather && <WeatherCard weather={weather} />}
          {forecast && <TemperatureChart data={forecast.list} />}
        </div>
      ) : (
        <EmptyState />
      )}

      <button className="themeToggle" onClick={toggleTheme} aria-label="Alterar Tema">
        {theme === "light" ? (
          <Moon size={22} className="themeToggleIcon" />
        ) : (
          <Sun size={22} className="themeToggleIcon" style={{ color: "#fbbf24" }} />
        )}
      </button>
    </div>
  );
}

export default App;
