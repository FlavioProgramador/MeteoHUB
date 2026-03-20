import axios from "axios";
import type { WeatherData } from "../Types/weather";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// Instância base com parâmetros que se repetem em todas as requisições
const api = axios.create({
    baseURL: "https://api.openweathermap.org",
    params: {
        appid: API_KEY,
        lang: 'pt_br'
    }
});

export async function getWeatherByAPI(city: string, unit: 'metric' | 'imperial' = 'metric') {
    try {
        const response = await api.get<WeatherData>("/data/2.5/weather", {
            params: { q: city, units: unit }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        throw error;
    }
}

export async function getWeatherByCoordinates(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') {
    try {
        const response = await api.get<WeatherData>("/data/2.5/weather", {
            params: { lat, lon, units: unit }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados da API por coordenadas:", error);
        throw error;
    }
}

export async function getForecastByAPI(city: string, unit: 'metric' | 'imperial' = 'metric') {
    try {
        const response = await api.get("/data/2.5/forecast", {
            params: { q: city, units: unit }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados de forecast da API:", error);
        throw error;
    }
}

export async function getForecastByCoordinates(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') {
    try {
        const response = await api.get("/data/2.5/forecast", {
            params: { lat, lon, units: unit }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados de forecast por coordenadas:", error);
        throw error;
    }
}

export async function getCitySuggestions(query: string) {
    try {
        const response = await api.get("/geo/1.0/direct", {
            params: { q: query, limit: 5 }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar sugestões de cidades:", error);
        return [];
    }
}