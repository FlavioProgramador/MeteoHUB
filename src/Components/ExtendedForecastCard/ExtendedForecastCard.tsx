import type { ExtendedForecastData } from "../../Types/extendedForecast";
import styles from "./ExtendedForecastCard.module.css";
import { CloudRain, Droplets, Thermometer } from "lucide-react";
import { motion } from "framer-motion";

interface ExtendedForecastCardProps {
  forecast: ExtendedForecastData;
  unit: "metric" | "imperial";
}

const weatherCodeMap: Record<number, { description: string; emoji: string }> = {
  0: { description: "Céu limpo", emoji: "☀️" },
  1: { description: "Predominantemente limpo", emoji: "🌤️" },
  2: { description: "Parcialmente nublado", emoji: "⛅" },
  3: { description: "Nublado", emoji: "☁️" },
  45: { description: "Neblina", emoji: "🌫️" },
  48: { description: "Neblina com gelo", emoji: "🌫️" },
  51: { description: "Garoa leve", emoji: "🌦️" },
  53: { description: "Garoa moderada", emoji: "🌦️" },
  55: { description: "Garoa densa", emoji: "🌧️" },
  61: { description: "Chuva leve", emoji: "🌧️" },
  63: { description: "Chuva moderada", emoji: "🌧️" },
  65: { description: "Chuva forte", emoji: "🌧️" },
  66: { description: "Chuva congelante leve", emoji: "🌨️" },
  67: { description: "Chuva congelante forte", emoji: "🌨️" },
  71: { description: "Neve leve", emoji: "❄️" },
  73: { description: "Neve moderada", emoji: "❄️" },
  75: { description: "Neve forte", emoji: "❄️" },
  77: { description: "Grãos de neve", emoji: "❄️" },
  80: { description: "Chuva leve", emoji: "🌦️" },
  81: { description: "Chuva moderada", emoji: "🌧️" },
  82: { description: "Chuva torrencial", emoji: "⛈️" },
  85: { description: "Neve leve", emoji: "❄️" },
  86: { description: "Neve forte", emoji: "❄️" },
  95: { description: "Tempestade", emoji: "⛈️" },
  96: { description: "Tempestade com granizo", emoji: "⛈️" },
  99: { description: "Tempestade com granizo forte", emoji: "⛈️" },
};

function getWeatherInfo(code: number) {
  return weatherCodeMap[code] || { description: "Desconhecido", emoji: "❓" };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  if (isToday) return "Hoje";

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) return "Amanhã";

  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const ExtendedForecastCard = ({
  forecast,
  unit,
}: ExtendedForecastCardProps) => {
  const unitSymbol = unit === "metric" ? "°C" : "°F";
  const rainUnit = unit === "metric" ? "mm" : "in";

  return (
    <div className={styles.extendedCard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Thermometer size={20} className={styles.icon} />
          <h3 className={styles.title}>Previsão 15 Dias</h3>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <Droplets size={12} /> Chuva
          </span>
        </div>
      </header>

      <div className={styles.forecastList}>
        {forecast.daily.map((day, index) => {
          const weatherInfo = getWeatherInfo(day.weatherCode);
          const hasRain =
            day.precipitationSum > 0 || day.precipitationProbability > 30;

          return (
            <motion.div
              key={day.date}
              className={styles.forecastDay}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={styles.dateColumn}>
                <span className={styles.dateText}>{formatDate(day.date)}</span>
              </div>

              <div className={styles.weatherColumn}>
                <span className={styles.weatherEmoji}>{weatherInfo.emoji}</span>
                <span className={styles.weatherDesc}>
                  {weatherInfo.description}
                </span>
              </div>

              <div className={styles.tempColumn}>
                <span className={styles.tempMax}>
                  {Math.round(day.tempMax)}
                  {unitSymbol}
                </span>
                <span className={styles.tempMin}>
                  {Math.round(day.tempMin)}
                  {unitSymbol}
                </span>
              </div>

              <div className={styles.rainColumn}>
                {hasRain ? (
                  <>
                    <CloudRain size={16} className={styles.rainIcon} />
                    <span className={styles.rainValue}>
                      {day.precipitationSum > 0
                        ? `${day.precipitationSum.toFixed(1)} ${rainUnit}`
                        : `${day.precipitationProbability}%`}
                    </span>
                  </>
                ) : (
                  <span className={styles.noRain}>—</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExtendedForecastCard;
