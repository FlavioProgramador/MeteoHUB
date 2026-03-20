import { type LucideIcon } from "lucide-react";
import styles from "./MainCard.module.css";

export interface WeatherItemProps {
  icon: LucideIcon;
  colorClass:
    | "teal"
    | "orange"
    | "blue"
    | "red"
    | "yellow"
    | "indigo"
    | "lightBlue"
    | "green";
  label: string;
  value: string | number;
  iconStyle?: React.CSSProperties;
}

export const WeatherListItem = ({
  icon: Icon,
  colorClass,
  label,
  value,
  iconStyle,
}: WeatherItemProps) => {
  return (
    <div className={styles.listItem}>
      <div className={`${styles.iconBox} ${styles[`${colorClass}Box`]}`}>
        <Icon size={20} className={styles[`${colorClass}Icon`]} style={iconStyle} />
      </div>
      <div className={styles.listText}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  );
};
