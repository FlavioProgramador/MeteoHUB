import type { UVIndexData } from "../../Types/weather";
import styles from "./UVIndexCard.module.css";
import { Sun } from "lucide-react";

interface UVIndexCardProps {
  data: UVIndexData;
}

export function UVIndexCard({ data }: UVIndexCardProps) {
  if (!data || data.value === undefined) return null;

  const uvValue = data.value;

  let label = "Baixo";
  let color = "#4CAF50"; 
  let textColor = "#fff";
  let description = "Seguro para ficar ao ar livre.";

  if (uvValue >= 11) {
    label = "Extremo";
    color = "#9C27B0"; 
    description = "Risco extremo! Fique em local coberto e protegido.";
  } else if (uvValue >= 8) {
    label = "Muito Alto";
    color = "#F44336"; 
    description = "Evite o sol entre 10h e 16h. Muita proteção necessária!";
  } else if (uvValue >= 6) {
    label = "Alto";
    color = "#FF9800"; 
    description = "Necessário proteção (chapéu, óculos, protetor FPS 30+).";
  } else if (uvValue >= 3) {
    label = "Moderado";
    color = "#FFEB3B"; 
    textColor = "#333";
    description = "Use protetor solar se exposto por muito tempo.";
  }

  const progressPercent = Math.min((uvValue / 15) * 100, 100);

  return (
    <div className={styles.uvCard}>
      <h3 className={styles.title}>
        <Sun size={24} />
        Índice UV
      </h3>

      <div className={styles.content}>
        <div className={styles.circleContainer}>
          <svg className={styles.svgCircle} viewBox="0 0 36 36">
            <path
              className={styles.circleBg}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={styles.circleProgress}
              strokeDasharray={`${progressPercent}, 100`}
              style={{ stroke: color }}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className={styles.circleValue}>
            <strong>{Math.round(uvValue)}</strong>
            <span>{label}</span>
          </div>
        </div>

        <div className={styles.info}>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
