import React from "react";
import "./App.css";
import type { WeatherData } from "./Types/weather";
import { getWeatherByAPI } from "./Services/api";
import WeatherCard from "./Components/WeatherCard";

function App() {
  const [city, setCity] = React.useState("");
  const [weather, setWeather] = React.useState<WeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
      console.log("dados: ", data);
    } catch (err) {
      setError("Erro ao buscar dados da API");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>MeteoHub - Previsão do Tempo</h1>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          name="city" 
          placeholder="Digite o nome da cidade" 
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar clima"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <div>
        {weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  );
}

export default App;
