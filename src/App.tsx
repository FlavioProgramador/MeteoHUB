import React, { useEffect, useState } from "react";
import "./App.css";
import type { WeatherData } from "./Types/weather";
import { getWeatherByAPI } from "./Services/api";
import WeatherCard from "./Components/WeatherCard/WeatherCard";
import EmptyState from "./Components/EmptyState/EmptyState";
import { Search, Moon, Sun, CloudSun } from "lucide-react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
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

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const cidadeDigitada = formData.get("city") as string;

    if (!cidadeDigitada) return;
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByAPI(cidadeDigitada);
      setWeather(data);
    } catch (err) {
      setError("Erro ao buscar dados da API. Tem certeza de que a cidade " + cidadeDigitada + " existe?");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <div className="logoContainer">
        <CloudSun size={64} className="logoIcon" />
        <h1 className="logoText">MeteoHub</h1>
      </div>

      <div className="searchContainer">
        <form className="searchForm" onSubmit={handleSearch}>
          <input
            className="searchInput"
            type="text"
            name="city"
            placeholder="Digite o nome da cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="searchIconBtn" type="submit" disabled={loading} aria-label="Buscar">
            <Search size={22} className="searchIconBlue" />
          </button>
        </form>

        <button className="locationBtn" type="button">
          Usar Localização
        </button>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <div className="content-wrapper">
        {weather ? <WeatherCard weather={weather} /> : <EmptyState />}
      </div>

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
