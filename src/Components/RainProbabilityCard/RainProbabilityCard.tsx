import { CloudRain, Droplet } from "lucide-react";
import type { ExtendedForecastData } from "../../Types/extendedForecast";
import styles from "./RainProbabilityCard.module.css";

interface RainProbabilityCardProps {
  forecast: ExtendedForecastData;
}

const RainProbabilityCard = ({ forecast }: RainProbabilityCardProps) => {
  const dailyData = forecast.daily.slice(0, 5);
  
  const maxRainDay = dailyData.reduce(
    (max, day) => day.precipitationProbability > max.precipitationProbability ? day : max,
    dailyData[0]
  );

  const hasRainInForecast = maxRainDay.precipitationProbability > 0;

  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.header}>
        <CloudRain size={16} className={styles.headerIcon} />
        <h2>Previsão de Chuva</h2>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.heroPercentage}>
            {maxRainDay.precipitationProbability}%
          </span>
          <span className={styles.heroLabel}>
            {hasRainInForecast ? "Pico de Chance" : "Máxima"}
          </span>
        </div>
        
        <div className={styles.heroRight}>
          <p className={styles.heroDesc}>
            {hasRainInForecast 
              ? `Maior probabilidade de precipitação concentrada na ${new Date(maxRainDay.date).toLocaleDateString('pt-BR', { weekday: 'long' })}.`
              : "Sem probabilidade de chuva para os próximos dias."}
          </p>
        </div>
      </div>

      <div className={styles.daysContainer}>
        {dailyData.map((day) => {
          const date = new Date(day.date);
          const today = new Date();
          const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
          const dayName = isToday ? "Hoje" : date.toLocaleDateString("pt-BR", { weekday: "short" }).replace('.', '');
          const chance = day.precipitationProbability;

          return (
            <div key={day.date} className={`${styles.dayCol} ${chance < 20 ? styles.lowChance : ''}`}>
              <span className={styles.dayName}>{dayName}</span>
              
              <Droplet 
                size={22} 
                className={styles.dropIcon}
                fill={chance >= 30 ? "#60a5fa" : "transparent"}
                strokeWidth={chance >= 30 ? 0 : 2}
                style={{ 
                  opacity: chance === 0 ? 0.15 : Math.max(0.4, chance / 100),
                  color: "#60a5fa" 
                }} 
              />
              
              <div className={styles.chanceWrapper}>
                <span className={styles.chanceText}>{chance}%</span>
                {day.precipitationSum > 0 && (
                  <span className={styles.amountText}>{day.precipitationSum.toFixed(1)}mm</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RainProbabilityCard;
