import { useState } from "react";
import type { WeatherData } from "../../Types/weather";
import { AlertTriangle, X } from "lucide-react";
import styles from "./WeatherAlert.module.css";
import { deriveAlerts } from "../../Utils/weatherAlerts";

interface WeatherAlertProps {
  weather: WeatherData;
  unit: "metric" | "imperial";
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
