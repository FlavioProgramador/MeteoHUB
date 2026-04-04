import { useState, useCallback } from 'react';
import type { ExtendedForecastData } from '../Types/extendedForecast';
import { getExtendedForecast } from '../Services/openWeatherApi';

export function useExtendedForecast(unit: 'metric' | 'imperial') {
  const [extendedForecast, setExtendedForecast] = useState<ExtendedForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExtendedForecast = useCallback(async (lat: number, lon: number, cityName?: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getExtendedForecast(lat, lon, unit);

      if (cityName) {
        data.location.name = cityName;
      }

      setExtendedForecast(data);
    } catch (err) {
      setError("Erro ao buscar previsão estendida de 15 dias.");
      setExtendedForecast(null);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  return {
    extendedForecast,
    loading,
    error,
    fetchExtendedForecast
  };
}
