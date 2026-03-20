import React from "react";
import type { WeatherData } from "../Types/weather";
import HeaderCard from "./HeaderCard";
import MainCard from "./MainCard";
import FooterCard from "./FooterCard";

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard = ({ weather }: WeatherCardProps) => {
  return (
    <div className="container-card">
      <HeaderCard weather={weather} />
      <MainCard weather={weather} />
      <FooterCard />
    </div>
  );
};

export default WeatherCard;
