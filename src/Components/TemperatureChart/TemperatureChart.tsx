import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { ForecastItem } from "../../Types/forecast";
import styles from "./TemperatureChart.module.css";

interface TemperatureChartProps {
  data: ForecastItem[];
  unit: "metric" | "imperial";
}

const TemperatureChart = ({ data, unit }: TemperatureChartProps) => {
  if (!data || data.length === 0) return null;
  const next24Hours = data.slice(0, 8).map((item) => {
    const date = new Date(item.dt_txt);
    const horaFormatada = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      time: horaFormatada,
      temp: Math.round(item.main.temp),
    };
  });

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>Previsão (Próximas 24h)</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={next24Hours}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.6)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.6)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{
                stroke: "rgba(255,255,255,0.2)",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
              itemStyle={{ color: "#60a5fa", fontWeight: "bold" }}
              labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
              formatter={(value) => [`${value}º${unit === 'metric' ? 'C' : 'F'}`, 'Temp']}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#60a5fa"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTemp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureChart;
