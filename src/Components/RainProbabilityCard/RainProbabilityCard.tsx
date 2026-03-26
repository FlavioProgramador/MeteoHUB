import type { ExtendedForecastData } from "../../Types/extendedForecast";
import styles from "./RainProbabilityCard.module.css";
import { CloudRain, Umbrella } from "lucide-react";
import { motion } from "framer-motion";

interface RainProbabilityCardProps {
  forecast: ExtendedForecastData;
}

const RainProbabilityCard = ({ forecast }: RainProbabilityCardProps) => {
  const rainyDays = forecast.daily.filter(
    (day) => day.precipitationProbability > 40 || day.precipitationSum > 5,
  );

  const maxRainDay = forecast.daily.reduce(
    (max, day) =>
      day.precipitationProbability > max.precipitationProbability ? day : max,
    forecast.daily[0],
  );

  const getRainRiskLevel = (probability: number) => {
    if (probability >= 80) return { label: "Extremo", color: "#9b59b6" };
    if (probability >= 60) return { label: "Alto", color: "#e74c3c" };
    if (probability >= 40) return { label: "Moderado", color: "#f39c12" };
    if (probability >= 20) return { label: "Baixo", color: "#f1c40f" };
    return { label: "Mínimo", color: "#2ecc71" };
  };

  const riskLevel = getRainRiskLevel(maxRainDay.precipitationProbability);

  return (
    <div className={styles.rainCard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <CloudRain size={20} className={styles.icon} />
          <h3 className={styles.title}>Previsão de Chuva</h3>
        </div>
        <Umbrella size={20} className={styles.umbrellaIcon} />
      </header>

      <div className={styles.content}>
        <motion.div
          className={styles.mainStat}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.ringContainer}>
            <svg className={styles.ringSvg} viewBox="0 0 36 36">
              <path
                className={styles.ringBg}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={styles.ringProgress}
                strokeDasharray={`${maxRainDay.precipitationProbability}, 100`}
                style={{ stroke: riskLevel.color }}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className={styles.ringValue}>
              <span className={styles.percentage}>
                {maxRainDay.precipitationProbability}%
              </span>
              <span className={styles.riskLabel}>{riskLevel.label}</span>
            </div>
          </div>

          <div className={styles.info}>
            <p className={styles.date}>
              {new Date(maxRainDay.date).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <p className={styles.description}>Dia com maior chance de chuva</p>
          </div>
        </motion.div>

        <div className={styles.rainyDaysList}>
          <h4 className={styles.subtitle}>
            <CloudRain size={16} />
            Dias chuvosos ({rainyDays.length})
          </h4>

          <div className={styles.daysGrid}>
            {rainyDays.slice(0, 5).map((day, index) => (
              <motion.div
                key={day.date}
                className={styles.rainyDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className={styles.dayDate}>
                  {new Date(day.date).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <div className={styles.dayInfo}>
                  <span className={styles.dayChance}>
                    {day.precipitationProbability}%
                  </span>
                  {day.precipitationSum > 0 && (
                    <span className={styles.dayAmount}>
                      {day.precipitationSum.toFixed(1)}mm
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RainProbabilityCard;
