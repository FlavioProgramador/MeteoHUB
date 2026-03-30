import type { WeatherData, AirPollutionData, UVIndexData } from "../../Types/weather";
import { SunArcCard } from "../SunArcCard/SunArcCard";
import { MoonPhaseCard } from "../MoonPhaseCard/MoonPhaseCard";
import { UVIndexCard } from "../UVIndexCard/UVIndexCard";
import { AirQualityCard } from "../AirQualityCard/AirQualityCard";

interface WeatherDetailsGridProps {
  weather: WeatherData | null;
  uvIndex: UVIndexData | null;
  airPollution: AirPollutionData | null;
  styles: Record<string, string>;
}

export function WeatherDetailsGrid({ weather, uvIndex, airPollution, styles }: WeatherDetailsGridProps) {
  return (
    <div className={styles.gridContainer}>
      {weather && (
        <div className={styles.sunArcWrapper}>
          <SunArcCard weather={weather} />
        </div>
      )}

      <div className={styles.moonPhaseWrapper}>
        <MoonPhaseCard />
      </div>

      {uvIndex && (
        <div className={styles.uvIndexWrapper}>
          <UVIndexCard data={uvIndex} />
        </div>
      )}

      {airPollution && (
        <div className={styles.airQualityWrapper}>
          <AirQualityCard data={airPollution} />
        </div>
      )}
    </div>
  );
}
