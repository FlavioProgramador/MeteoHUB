import type { AirPollutionData } from "../../Types/weather";
import styles from "./AirQualityCard.module.css";
import { FiWind } from "react-icons/fi";

interface AirQualityCardProps {
  data: AirPollutionData;
}

const AQI_DICT: Record<number, { label: string; color: string; textColor: string }> = {
  1: { label: "Boa", color: "#4CAF50", textColor: "#fff" }, 
  2: { label: "Justa", color: "#8BC34A", textColor: "#333" }, 
  3: { label: "Moderada", color: "#FFEB3B", textColor: "#333" }, 
  4: { label: "Ruim", color: "#FF9800", textColor: "#fff" }, 
  5: { label: "Muito Ruim", color: "#F44336", textColor: "#fff" }, 
};

import { InfoTooltip } from "../InfoTooltip/InfoTooltip";

export function AirQualityCard({ data }: AirQualityCardProps) {
  if (!data || !data.list || data.list.length === 0) return null;

  const current = data.list[0];
  const aqiInfo = AQI_DICT[current.main.aqi] || { label: "Desconhecida", color: "#9E9E9E", textColor: "#fff" };

  return (
    <div className={styles.airQualityCard}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '16px' }}>
        <h3 className={styles.title} style={{ margin: 0 }}>
          <FiWind className={styles.icon} /> Qualidade do Ar
        </h3>
        <InfoTooltip content={
          <>
            <strong>AQI:</strong> Índice de Qualidade do Ar<br/>
            <strong>PM2.5:</strong> Partículas finas<br/>
            <strong>PM10:</strong> Partículas inaláveis<br/>
            <strong>O³:</strong> Ozônio<br/>
            <strong>NO²:</strong> Dióxido de nitrogênio
          </>
        } />
      </div>
      <div className={styles.content}>
        <div className={styles.aqiBadge} style={{ backgroundColor: aqiInfo.color, color: aqiInfo.textColor }}>
          <span>{aqiInfo.label}</span>
          <strong>AQI {current.main.aqi}</strong>
        </div>
        
        <div className={styles.componentsGrid}>
          <div className={styles.componentItem}>
            <span>PM2.5</span>
            <strong>{current.components.pm2_5} <small>µg/m³</small></strong>
          </div>
          <div className={styles.componentItem}>
            <span>PM10</span>
            <strong>{current.components.pm10} <small>µg/m³</small></strong>
          </div>
          <div className={styles.componentItem}>
            <span>O³</span>
            <strong>{current.components.o3} <small>µg/m³</small></strong>
          </div>
          <div className={styles.componentItem}>
            <span>NO²</span>
            <strong>{current.components.no2} <small>µg/m³</small></strong>
          </div>
        </div>
      </div>
    </div>
  );
}
