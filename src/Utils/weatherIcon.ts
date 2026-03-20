/**
 * Mapeia os códigos de clima da OpenWeatherMap para ícones animados Meteocons.
 * Ícones SVG via CDN oficial: https://bas.dev/work/meteocons
 * Documentação dos códigos: https://openweathermap.org/weather-conditions
 */

const BASE =
  "https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg";

/** Retorna a URL do SVG animado Meteocon correspondente ao código OWM e se é dia/noite */
export function getWeatherIconUrl(code: number, isDay = true): string {
  const suffix = isDay ? "" : "-night";

  // Thunderstorm (200–232)
  if (code >= 200 && code < 300) {
    if (code === 210 || code === 211 || code === 212) return `${BASE}/thunderstorms.svg`;
    return `${BASE}/thunderstorms-rain.svg`;
  }

  // Drizzle (300–321)
  if (code >= 300 && code < 400) {
    return `${BASE}/drizzle.svg`;
  }

  // Rain (500–531)
  if (code >= 500 && code < 600) {
    if (code === 511) return `${BASE}/sleet.svg`;
    if (code === 502 || code === 503 || code === 504) return `${BASE}/extreme-rain.svg`;
    return `${BASE}/rain.svg`;
  }

  // Snow (600–622)
  if (code >= 600 && code < 700) {
    if (code === 611 || code === 612 || code === 613) return `${BASE}/sleet.svg`;
    if (code === 615 || code === 616) return `${BASE}/sleet.svg`;
    return `${BASE}/snow.svg`;
  }

  // Atmosphere (700–781)
  if (code >= 700 && code < 800) {
    if (code === 741) return `${BASE}/fog.svg`;
    if (code === 781) return `${BASE}/tornado.svg`;
    return `${BASE}/haze.svg`;
  }

  // Clear (800)
  if (code === 800) {
    return isDay ? `${BASE}/clear-day.svg` : `${BASE}/clear-night.svg`;
  }

  // Clouds (801–804)
  if (code === 801) return `${BASE}/partly-cloudy-${isDay ? "day" : "night"}.svg`;
  if (code === 802) return `${BASE}/partly-cloudy-${isDay ? "day" : "night"}.svg`;
  if (code === 803 || code === 804) return `${BASE}/overcast${suffix}.svg`;

  // Fallback
  return isDay ? `${BASE}/clear-day.svg` : `${BASE}/clear-night.svg`;
}

/** Determina se é dia baseado no sunrise/sunset da API */
export function isDaytime(sunrise: number, sunset: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now >= sunrise && now < sunset;
}
