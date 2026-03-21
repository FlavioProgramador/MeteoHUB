import { useState, useEffect } from "react";
import type { WeatherData } from "../../Types/weather";
import styles from "./SunArcCard.module.css";
import { FiSunrise, FiSunset } from "react-icons/fi";

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
      const now = Math.floor(Date.now() / 1000); // Current UTC timestamp
      
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
    // Calcula a hora local considerando o timezone (offset em segundos de UTC)
    // Multiplicamos por 1000 por causa do Date
    const localDate = new Date((timestamp + timezoneOffset) * 1000);
    // Mas Date exibe baseado no fuso horário do sistema se tentarmos formatar.
    // Para manter a data 'errada' para o sistema e 'certa' visualmente:
    const utcHours = localDate.getUTCHours();
    const utcMinutes = localDate.getUTCMinutes();
    
    return `${utcHours.toString().padStart(2, "0")}:${utcMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Posicionamento do Sol no SVG
  // O caminho é uma semi-elipse, de (10, 90) até (190, 90) passando por um topo curvo.
  // Equação paramétrica da elipse para X e Y:
  // cx = 100, cy = 90, rx = 90, ry = 60
  // angulo = 180 (nascer) até 0 (pôr), proporcional ao progresso (0% = PI, 100% = 0)
  
  const angle = Math.PI - (progress / 100) * Math.PI;
  const sunX = 100 + 90 * Math.cos(angle);
  const sunY = 90 - 60 * Math.sin(angle);

  return (
    <div className={styles.sunCard}>
      <h3 className={styles.title}>
        <FiSunrise className={styles.icon} /> Ciclo Solar
      </h3>

      <div className={styles.arcContainer}>
        <svg viewBox="0 0 200 110" className={styles.svgArc}>
          {/* Fundo do Trajeto do Sol */}
          <path
            d="M 10 90 A 90 60 0 0 1 190 90"
            fill="none"
            stroke="rgba(148, 163, 184, 0.4)"
            strokeWidth="3"
            strokeDasharray="6, 6"
          />

          {/* Sol Dinâmico */}
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
            <FiSunrise size={18} />
            <span>{formatTime(sunrise)}</span>
          </div>
          <div className={styles.timeLabel}>
            <FiSunset size={18} />
            <span>{formatTime(sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
