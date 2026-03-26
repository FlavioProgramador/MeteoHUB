export interface DailyForecastItem {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  weatherCode: number;
  sunrise: number;
  sunset: number;
}

export interface ExtendedForecastData {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  daily: DailyForecastItem[];
}

export interface WeatherCodeInfo {
  code: number;
  description: string;
  icon: string;
}
