import { useEffect } from "react";
import type { WeatherData } from "../Types/weather";

export function useUpdateWeatherBackground(weather: WeatherData | null | undefined) {
  useEffect(() => {
    if (weather && weather.weather && weather.weather.length > 0) {
      const condition = weather.weather[0].main.toLowerCase();
      document.documentElement.setAttribute("data-weather", condition);
    } else {
      document.documentElement.removeAttribute("data-weather");
    }
  }, [weather]);
}
