import axios from "axios";
import type { WeatherData, AirPollutionData, UVIndexData } from "../Types/weather";
import type { ForecastData } from "../Types/forecast";
import type { ExtendedForecastData } from "../Types/extendedForecast";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const api = axios.create({
    baseURL: "https://api.openweathermap.org",
    params: {
        appid: API_KEY,
        lang: 'pt_br'
    }
});

const openMeteoApi = axios.create({
    baseURL: "https://api.open-meteo.com/v1"
});

const CACHE_TTL = 1000 * 60 * 60; // 1 hora de cache

async function fetchWithCache<T>(
    axiosInstance: any, 
    url: string, 
    params: object, 
    errorMsg: string
): Promise<T> {
    const cacheKey = "MeteoHubCache_" + url + "?" + JSON.stringify(params);
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
        try {
            const { timestamp, data } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_TTL) {
                console.log("[Cache] Retornando de: " + url);
                return data;
            } else {
                localStorage.removeItem(cacheKey);
            }
        } catch (e) {
            localStorage.removeItem(cacheKey);
        }
    }

    try {
        const response = await axiosInstance.get(url, { params });
        const cachePayload = {
            timestamp: Date.now(),
            data: response.data
        };
        localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
        return response.data;
    } catch (error) {
        console.error(errorMsg, error);
        throw error;
    }
}

export function getWeatherByAPI(city: string, unit: 'metric' | 'imperial' = 'metric') {
    return fetchWithCache<WeatherData>(api, "/data/2.5/weather", { q: city, units: unit }, "Erro ao buscar dados da API:");
}

export function getWeatherByCoordinates(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') {
    return fetchWithCache<WeatherData>(api, "/data/2.5/weather", { lat, lon, units: unit }, "Erro ao buscar dados da API por coordenadas:");
}

export function getForecastByAPI(city: string, unit: 'metric' | 'imperial' = 'metric') {
    return fetchWithCache<ForecastData>(api, "/data/2.5/forecast", { q: city, units: unit }, "Erro ao buscar dados de forecast da API:");
}

export function getForecastByCoordinates(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') {
    return fetchWithCache<ForecastData>(api, "/data/2.5/forecast", { lat, lon, units: unit }, "Erro ao buscar dados de forecast por coordenadas:");
}

export function getAirPollutionByCoordinates(lat: number, lon: number) {
    return fetchWithCache<AirPollutionData>(api, "/data/2.5/air_pollution", { lat, lon }, "Erro ao buscar dados de poluição do ar:");
}

export function getUVIndexByCoordinates(lat: number, lon: number) {
    return fetchWithCache<UVIndexData>(api, "/data/2.5/uvi", { lat, lon }, "Erro ao buscar dados de UV:");
}

export async function getCitySuggestions(query: string) {
    try {
        // Limite menor para sugestão para não estourar TTL, 5 minutos é bom.
        return await fetchWithCache<unknown[]>(api, "/geo/1.0/direct", { q: query, limit: 5 }, "Erro ao buscar sugestões de cidades:");
    } catch {
        return [];
    }
}

export async function getExtendedForecast(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') {
    const temperatureUnit = unit === 'metric' ? 'celsius' : 'fahrenheit';

    try {
        const data = await fetchWithCache<any>(
            openMeteoApi, 
            '/forecast', 
            {
                latitude: lat,
                longitude: lon,
                daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,sunrise,sunset',
                timezone: 'auto',
                forecast_days: 15
            }, 
            "Erro ao buscar previsão estendida:"
        );

        const daily: ExtendedForecastData['daily'] = [];

        for (let i = 0; i < data.daily.time.length; i++) {
            daily.push({
                date: data.daily.time[i],
                tempMax: data.daily.temperature_2m_max[i],
                tempMin: data.daily.temperature_2m_min[i],
                precipitationSum: data.daily.precipitation_sum[i],
                precipitationProbability: data.daily.precipitation_probability_max[i],
                weatherCode: data.daily.weather_code[i],
                sunrise: Math.floor(new Date(data.daily.sunrise[i]).getTime() / 1000),
                sunset: Math.floor(new Date(data.daily.sunset[i]).getTime() / 1000)
            });
        }

        return {
            location: {
                name: '',
                lat,
                lon
            },
            daily
        } as ExtendedForecastData;
    } catch (error) {
        console.error("Erro ao buscar previsão estendida:", error);
        throw error;
    }
}
