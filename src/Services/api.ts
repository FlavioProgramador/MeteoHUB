import axios from "axios";
import type { WeatherData } from "../Types/weather";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const api = axios.create({
    baseURL: "https://api.openweathermap.org",
    params: {
        appid: API_KEY,
        lang: 'pt_br'
    }
});

async function fetchFromApi<T>(url: string, params: object, errorMsg: string): Promise<T> {
    try {
        const response = await api.get<T>(url, { params });
        return response.data;
    } catch (error) {
        console.error(errorMsg, error);
        throw error;
    }
}

export function getWeatherByAPI(city: string, unit: 'metric' | 'imperial' = 'metric') {
    return fetchFromApi<WeatherData>("/data/2.5/weather", { q: city, units: unit }, "Erro ao buscar dados da API:");
}

export function getWeatherByCoordinates(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') {
    return fetchFromApi<WeatherData>("/data/2.5/weather", { lat, lon, units: unit }, "Erro ao buscar dados da API por coordenadas:");
}

export function getForecastByAPI(city: string, unit: 'metric' | 'imperial' = 'metric') {
    return fetchFromApi<unknown>("/data/2.5/forecast", { q: city, units: unit }, "Erro ao buscar dados de forecast da API:");
}

export function getForecastByCoordinates(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') {
    return fetchFromApi<unknown>("/data/2.5/forecast", { lat, lon, units: unit }, "Erro ao buscar dados de forecast por coordenadas:");
}

export function getAirPollutionByCoordinates(lat: number, lon: number) {
    return fetchFromApi<unknown>("/data/2.5/air_pollution", { lat, lon }, "Erro ao buscar dados de poluição do ar:");
}

export function getUVIndexByCoordinates(lat: number, lon: number) {
    return fetchFromApi<unknown>("/data/2.5/uvi", { lat, lon }, "Erro ao buscar dados de UV:");
}

export async function getCitySuggestions(query: string) {
    try {
        return await fetchFromApi<unknown[]>("/geo/1.0/direct", { q: query, limit: 5 }, "Erro ao buscar sugestões de cidades:");
    } catch {
        return [];
    }
}