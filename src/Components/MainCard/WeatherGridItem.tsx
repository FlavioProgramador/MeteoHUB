import styles from "./MainCard.module.css";
import type { WeatherItemProps } from "./WeatherListItem";

export const WeatherGridItem = ({
  icon: Icon,
  colorClass,
  label,
  value,
}: WeatherItemProps) => {
  return (
    <div className={styles.miniCard}>
      <div className={styles.miniCardHeader}>
        <Icon size={18} className={styles[`${colorClass}Icon`]} />
        <span className={styles.label}>{label}</span>
      </div>
      <span className={styles.value}>{value}</span>
    </div>
  );
};
