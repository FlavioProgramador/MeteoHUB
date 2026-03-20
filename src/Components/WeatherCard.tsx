import React from "react";
import type { WeatherData } from "../Types/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard = ({ weather }: WeatherCardProps) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const directionIndex = Math.round(weather.wind.deg / 45) % 8;
  const windDirection = directions[directionIndex];

  return (
    <div className="container-card">
      <header>
        <h2>Tempo atual em: {weather.name}</h2>
        <h1>{weather.main.temp}°C</h1>
        <p>Condição: {weather.weather[0].description}</p>
      </header>
      <main>
        <div>
          <p>Umidade: {weather.main.humidity}%</p>
          <p>Vento: {weather.wind.speed} km/h</p>
          <p>Direção do vento: {windDirection}</p>
          <p>
            Mín: {weather.main.temp_min}°C | Máx: {weather.main.temp_max}°C
          </p>
        </div>
        <div>
          <p>Maxima: {weather.main.temp_max}</p>
          <p>Minima: {weather.main.temp_min}</p>
          <p>
            chuva:{" "}
            {weather.rain?.["1h"] ? `${weather.rain["1h"]} mm/h` : "Sem previsão/volume"}
          </p>
          <p>Pressão: {weather.main.pressure} hPa</p>
        </div>
      </main>
    </div>
  );
};

export default WeatherCard;
