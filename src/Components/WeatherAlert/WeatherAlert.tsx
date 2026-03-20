import { useState } from "react";
import type { WeatherData } from "../../Types/weather";
import { AlertTriangle, X, Wind, Thermometer, Droplets, CloudLightning, CloudSnow, Eye } from "lucide-react";
import styles from "./WeatherAlert.module.css";

interface Alert {
  icon: React.ElementType;
  title: string;
  message: string;
  level: "warning" | "danger";
}

interface WeatherAlertProps {
  weather: WeatherData;
  unit: "metric" | "imperial";
}

function deriveAlerts(weather: WeatherData, unit: "metric" | "imperial"): Alert[] {
  const alerts: Alert[] = [];
  const condition = weather.weather[0].id;
  const windSpeed = weather.wind.speed;
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const visibility = weather.visibility;

  // Limites conforme a unidade
  const windDanger = unit === "metric" ? 80 : 50;   // km/h ou mph
  const windWarning = unit === "metric" ? 50 : 31;
  const tempHeatDanger = unit === "metric" ? 42 : 108;
  const tempHeatWarning = unit === "metric" ? 36 : 97;
  const tempColdDanger = unit === "metric" ? -15 : 5;
  const tempColdWarning = unit === "metric" ? 0 : 32;

  // Tempestades elétricas (IDs 200–232)
  if (condition >= 200 && condition <= 232) {
    alerts.push({
      icon: CloudLightning,
      title: "⚡ Tempestade Elétrica",
      message: "Risco de raios detectado. Evite áreas abertas e procure abrigo imediatamente.",
      level: "danger",
    });
  }

  // Neve ou nevasca (IDs 600–622)
  if (condition >= 600 && condition <= 622) {
    alerts.push({
      icon: CloudSnow,
      title: "❄️ Neve / Nevasca",
      message: "Condições de neve na região. Cuidado ao dirigir e prepare-se para baixas temperaturas.",
      level: condition >= 621 ? "danger" : "warning",
    });
  }

  // Vendaval
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

  // Calor extremo
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

  // Frio extremo
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

  // Umidade muito alta
  if (humidity >= 95) {
    alerts.push({
      icon: Droplets,
      title: "💧 Umidade Muito Alta",
      message: `Umidade de ${humidity}% — sensação de abafamento. Recomendado permanecer em ambientes ventilados.`,
      level: "warning",
    });
  }

  // Visibilidade baixa
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

export const WeatherAlert = ({ weather, unit }: WeatherAlertProps) => {
  const alerts = deriveAlerts(weather, unit);
  const [dismissed, setDismissed] = useState<number[]>([]);

  const visible = alerts.filter((_, i) => !dismissed.includes(i));
  if (visible.length === 0) return null;

  return (
    <div className={styles.alertsContainer}>
      {alerts.map((alert, i) => {
        if (dismissed.includes(i)) return null;
        const Icon = alert.icon;
        return (
          <div
            key={i}
            className={`${styles.alertBanner} ${
              alert.level === "danger" ? styles.danger : styles.warning
            }`}
          >
            <div className={styles.alertLeft}>
              <div className={styles.alertIconBox}>
                <AlertTriangle size={20} className={styles.alertTriangle} />
                <Icon size={18} className={styles.alertIcon} />
              </div>
              <div className={styles.alertText}>
                <strong className={styles.alertTitle}>{alert.title}</strong>
                <span className={styles.alertMessage}>{alert.message}</span>
              </div>
            </div>
            <button
              className={styles.dismissBtn}
              onClick={() => setDismissed((prev) => [...prev, i])}
              aria-label="Fechar alerta"
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
