import { Thermometer } from "lucide-react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ExtendedForecastData } from "../../Types/extendedForecast";
import styles from "./TemperatureTrendChart.module.css";

interface TemperatureTrendChartProps {
  forecast: ExtendedForecastData;
  unit: "metric" | "imperial";
}

const TemperatureTrendChart = ({
  forecast,
  unit,
}: TemperatureTrendChartProps) => {
  const unitSymbol = unit === "metric" ? "°C" : "°F";

  const chartData = forecast.daily.map((day) => ({
    date: new Date(day.date).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    }),
    tempMax: Math.round(day.tempMax),
    tempMin: Math.round(day.tempMin),
    precipitation: day.precipitationSum,
  }));

  const customTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          <p className={styles.tooltipMax}>
            Máx: {payload[0].value}
            {unitSymbol}
          </p>
          <p className={styles.tooltipMin}>
            Mín: {payload[1].value}
            {unitSymbol}
          </p>
          {payload[0].payload.precipitation > 0 && (
            <p className={styles.tooltipRain}>
              Chuva: {payload[0].payload.precipitation.toFixed(1)} mm
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartCard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Thermometer size={20} className={styles.icon} />
          <h3 className={styles.title}>Tendência de Temperatura</h3>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.maxDot}></span> Máx
          </span>
          <span className={styles.legendItem}>
            <span className={styles.minDot}></span> Mín
          </span>
        </div>
      </header>

      <div
        className={styles.chartContainer}
        style={{ width: "100%", height: "200px" }}
      >
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
              width={30}
            />
            <Tooltip content={customTooltip} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
            <Line
              type="monotone"
              dataKey="tempMax"
              stroke="#f39c12"
              strokeWidth={2}
              dot={{ fill: "#f39c12", strokeWidth: 1, r: 3 }}
              activeDot={{ r: 5 }}
              name="Máxima"
            />
            <Line
              type="monotone"
              dataKey="tempMin"
              stroke="#3498db"
              strokeWidth={2}
              dot={{ fill: "#3498db", strokeWidth: 1, r: 3 }}
              name="Mínima"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureTrendChart;
