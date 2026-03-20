import type { WeatherData } from "../Types/weather";
import { CloudLightning, CloudSnow, Wind, Thermometer, Droplets, Eye } from "lucide-react";
import React from "react";

export interface Alert {
  icon: React.ElementType;
  title: string;
  message: string;
  level: "warning" | "danger";
}

export function deriveAlerts(weather: WeatherData, unit: "metric" | "imperial"): Alert[] {
  const alerts: Alert[] = [];
  const condition = weather.weather[0].id;
  const windSpeed = weather.wind.speed;
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const visibility = weather.visibility;

  const windDanger = unit === "metric" ? 80 : 50;
  const windWarning = unit === "metric" ? 50 : 31;
  const tempHeatDanger = unit === "metric" ? 42 : 108;
  const tempHeatWarning = unit === "metric" ? 36 : 97;
  const tempColdDanger = unit === "metric" ? -15 : 5;
  const tempColdWarning = unit === "metric" ? 0 : 32;

  if (condition >= 200 && condition <= 232) {
    alerts.push({
      icon: CloudLightning,
      title: "⚡ Tempestade Elétrica",
      message: "Risco de raios detectado. Evite áreas abertas e procure abrigo imediatamente.",
      level: "danger",
    });
  }

  if (condition >= 600 && condition <= 622) {
    alerts.push({
      icon: CloudSnow,
      title: "❄️ Neve / Nevasca",
      message: "Condições de neve na região. Cuidado ao dirigir e prepare-se para baixas temperaturas.",
      level: condition >= 621 ? "danger" : "warning",
    });
  }

  if (windSpeed >= windDanger) {
    alerts.push({
      icon: Wind,
      title: "🌀 Ventos Extremos",
      message: `Velocidade do vento em ${windSpeed} ${unit === "metric" ? "km/h" : "mph"} — risco de queda de objetos e acidentes.`,
      level: "danger",
    });
  } else if (windSpeed >= windWarning) {
    alerts.push({
      icon: Wind,
      title: "💨 Vento Forte",
      message: `Velocidade do vento em ${windSpeed} ${unit === "metric" ? "km/h" : "mph"} — cuidado redobrado ao ar livre.`,
      level: "warning",
    });
  }

  if (temp >= tempHeatDanger) {
    alerts.push({
      icon: Thermometer,
      title: "🔥 Calor Extremo",
      message: `Temperatura de ${Math.round(temp)}° — risco de insolação. Mantenha-se hidratado e evite o sol direto.`,
      level: "danger",
    });
  } else if (temp >= tempHeatWarning) {
    alerts.push({
      icon: Thermometer,
      title: "☀️ Alta Temperatura",
      message: `Temperatura de ${Math.round(temp)}° — use protetor solar e consuma bastante água.`,
      level: "warning",
    });
  }

  if (temp <= tempColdDanger) {
    alerts.push({
      icon: Thermometer,
      title: "🥶 Frio Extremo",
      message: `Temperatura de ${Math.round(temp)}° — risco de hipotermia. Agasalhe-se bem.`,
      level: "danger",
    });
  } else if (temp <= tempColdWarning) {
    alerts.push({
      icon: Thermometer,
      title: "🧥 Temperatura Baixa",
      message: `Temperatura de ${Math.round(temp)}° — use roupas adequadas ao frio.`,
      level: "warning",
    });
  }

  if (humidity >= 95) {
    alerts.push({
      icon: Droplets,
      title: "💧 Umidade Muito Alta",
      message: `Umidade de ${humidity}% — sensação de abafamento. Recomendado permanecer em ambientes ventilados.`,
      level: "warning",
    });
  }

  if (visibility < 1000) {
    alerts.push({
      icon: Eye,
      title: "🌫️ Visibilidade Crítica",
      message: `Visibilidade de apenas ${visibility}m — extremo cuidado ao dirigir.`,
      level: "danger",
    });
  } else if (visibility < 3000) {
    alerts.push({
      icon: Eye,
      title: "🌁 Visibilidade Reduzida",
      message: `Visibilidade de ${visibility}m — neblina ou névoa na região. Redobre a atenção.`,
      level: "warning",
    });
  }

  return alerts;
}
