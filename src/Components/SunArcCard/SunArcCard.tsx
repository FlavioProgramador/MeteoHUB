import { useState, useEffect } from "react";
import type { WeatherData } from "../../Types/weather";
import styles from "./SunArcCard.module.css";
import { Sunrise, Sunset } from "lucide-react";

interface SunArcCardProps {
  weather: WeatherData;
}

export function SunArcCard({ weather }: SunArcCardProps) {
  const [progress, setProgress] = useState(0);

  const sunrise = weather.sys.sunrise;
  const sunset = weather.sys.sunset;
  const timezoneOffset = weather.timezone;

  useEffect(() => {
    const updateProgress = () => {
      const now = Math.floor(Date.now() / 1000); 
      
      let newProgress = 0;
      if (now <= sunrise) {
        newProgress = 0;
      } else if (now >= sunset) {
        newProgress = 100;
      } else {
        const totalDaylight = sunset - sunrise;
        const currentElapsed = now - sunrise;
        newProgress = (currentElapsed / totalDaylight) * 100;
      }
      setProgress(newProgress);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [sunrise, sunset]);

  const formatTime = (timestamp: number) => {
    const localDate = new Date((timestamp + timezoneOffset) * 1000);
    const utcHours = localDate.getUTCHours();
    const utcMinutes = localDate.getUTCMinutes();
    
    return `${utcHours.toString().padStart(2, "0")}:${utcMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const angle = Math.PI - (progress / 100) * Math.PI;
  const sunX = 100 + 90 * Math.cos(angle);
  const sunY = 90 - 60 * Math.sin(angle);

  return (
    <div className={styles.sunCard}>
      <h3 className={styles.title}>
        <Sunrise size={24} /> Ciclo Solar
      </h3>

      <div className={styles.arcContainer}>
        <svg viewBox="0 0 200 110" className={styles.svgArc}>
          <path
            d="M 10 90 A 90 60 0 0 1 190 90"
            fill="none"
            stroke="rgba(148, 163, 184, 0.4)"
            strokeWidth="3"
            strokeDasharray="6, 6"
          />
          <circle
            cx={sunX}
            cy={sunY}
            r="8"
            fill="#FFC107"
            filter="drop-shadow(0 0 6px rgba(255, 193, 7, 0.8))"
          />
        </svg>

        <div className={styles.timeLabels}>
          <div className={styles.timeLabel}>
            <Sunrise size={18} />
            <span>{formatTime(sunrise)}</span>
          </div>
          <div className={styles.timeLabel}>
            <Sunset size={18} />
            <span>{formatTime(sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
