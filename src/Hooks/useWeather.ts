import { useState } from 'react';
import type { WeatherData } from '../Types/weather';
import type { ForecastData } from '../Types/forecast';
import { getWeatherByAPI, getWeatherByCoordinates, getForecastByAPI, getForecastByCoordinates } from '../Services/api';

export function useWeather(unit: 'metric' | 'imperial') {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherByCity = async (city: string, onSuccess?: (cityName: string) => void) => {
    if (!city || !city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByAPI(city, unit);
      const forecastData = await getForecastByAPI(city, unit);
      setWeather(data);
      setForecast(forecastData);
      if (onSuccess) onSuccess(data.name);
    } catch (err) {
      setError(`Erro ao buscar dados da API. Tem certeza de que a cidade "${city}" existe?`);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number, onSuccess?: (cityName: string) => void) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCoordinates(lat, lon, unit);
      const forecastData = await getForecastByCoordinates(lat, lon, unit);
      setWeather(data);
      setForecast(forecastData);
      if (onSuccess) onSuccess(data.name);
    } catch (err) {
      setError("Erro ao buscar dados do clima para a localização atual.");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  return { 
    weather, 
    forecast, 
    loading, 
    error, 
    fetchWeatherByCity, 
    fetchWeatherByCoords,
    setError 
  };
}
