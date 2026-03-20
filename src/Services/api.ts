import axios from "axios"
import type { WeatherData } from "../Types/weather";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

async function getWeatherByAPI(city: string) {
    try {
        const response = await axios.get<WeatherData>(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`)
        return response.data

    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
    }
}

export { getWeatherByAPI }