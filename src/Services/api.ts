import axios from "axios"
import type { WeatherData } from "../Types/weather";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

async function getWeatherByAPI(city: string, unit: 'metric' | 'imperial' = 'metric') {
    try {
        const response = await axios.get<WeatherData>(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=${unit}&lang=pt_br`)
        return response.data

    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        throw error;
    }
}

async function getWeatherByCoordinates(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') {
    try {
        const response = await axios.get<WeatherData>(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}&lang=pt_br`)
        return response.data

    } catch (error) {
        console.error("Erro ao buscar dados da API por coordenadas:", error);
        throw error;
    }
}

const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const GEO_URL = "http://api.openweathermap.org/geo/1.0/direct";

async function getForecastByAPI(city: string, unit: 'metric' | 'imperial' = 'metric') {
    try {
        const response = await axios.get(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=${unit}&lang=pt_br`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados de forecast da API:", error);
        throw error;
    }
}

async function getForecastByCoordinates(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') {
    try {
        const response = await axios.get(`${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}&lang=pt_br`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados de forecast por coordenadas:", error);
        throw error;
    }
}

async function getCitySuggestions(query: string) {
    try {
        const response = await axios.get(`${GEO_URL}?q=${query}&limit=5&appid=${API_KEY}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar sugestões de cidades:", error);
        return [];
    }
}

export { getWeatherByAPI, getWeatherByCoordinates, getForecastByAPI, getForecastByCoordinates, getCitySuggestions }