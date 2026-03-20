import React from "react";
import type { WeatherData } from "../Types/weather";

interface HeaderCardProps {
  weather: WeatherData;
}

const HeaderCard = ({ weather }: HeaderCardProps) => {
  return (
    <div>
      <header>
        <h2>{weather.name}</h2>
        <h1>{weather.main.temp}°C</h1>
        <p>Condição: {weather.weather[0].description}</p>
      </header>
    </div>
  );
};

export default HeaderCard;
