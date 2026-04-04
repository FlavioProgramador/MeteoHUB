import { useState, useCallback, useRef } from 'react';
import type { WeatherData, AirPollutionData, UVIndexData } from '../Types/weather';
import type { ForecastData } from '../Types/forecast';
import { getWeatherByAPI, getWeatherByCoordinates, getForecastByAPI, getForecastByCoordinates, getAirPollutionByCoordinates, getUVIndexByCoordinates } from '../Services/openWeatherApi';

export function useWeather(unit: 'metric' | 'imperial') {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airPollution, setAirPollution] = useState<AirPollutionData | null>(null);
  const [uvIndex, setUvIndex] = useState<UVIndexData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unitRef = useRef(unit);
  unitRef.current = unit;

  const fetchExtraContext = useCallback(async (lat: number, lon: number) => {
    let pollutionData = null;
    let uvData = null;
    try {
      pollutionData = await getAirPollutionByCoordinates(lat, lon);
    } catch (e) {
      console.warn("Could not fetch air pollution data.");
    }
    try {
      uvData = await getUVIndexByCoordinates(lat, lon);
    } catch (e) {
      console.warn("Could not fetch UV index data.");
    }
    return { pollutionData, uvData };
  }, []);

  const fetchWeatherByCity = useCallback(async (city: string, onSuccess?: (cityName: string) => void) => {
    if (!city || !city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByAPI(city, unitRef.current);
      const forecastData = await getForecastByAPI(city, unitRef.current);

      const { pollutionData, uvData } = await fetchExtraContext(data.coord.lat, data.coord.lon);

      setWeather(data);
      setForecast(forecastData);
      setAirPollution(pollutionData);
      setUvIndex(uvData);

      if (onSuccess) onSuccess(data.name);
    } catch (err) {
      setError(`Erro ao buscar dados da API. Tem certeza de que a cidade "${city}" existe?`);
      setWeather(null);
      setForecast(null);
      setAirPollution(null);
      setUvIndex(null);
    } finally {
      setLoading(false);
    }
  }, [fetchExtraContext]);

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number, onSuccess?: (cityName: string) => void) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCoordinates(lat, lon, unitRef.current);
      const forecastData = await getForecastByCoordinates(lat, lon, unitRef.current);

      const { pollutionData, uvData } = await fetchExtraContext(lat, lon);

      setWeather(data);
      setForecast(forecastData);
      setAirPollution(pollutionData);
      setUvIndex(uvData);

      if (onSuccess) onSuccess(data.name);
    } catch (err) {
      setError("Erro ao buscar dados do clima para a localização atual.");
      setWeather(null);
      setForecast(null);
      setAirPollution(null);
      setUvIndex(null);
    } finally {
      setLoading(false);
    }
  }, [fetchExtraContext]);

  return {
    weather,
    forecast,
    airPollution,
    uvIndex,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    setError
  };
}
