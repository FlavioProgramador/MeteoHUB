import { describe, it, expect } from 'vitest';
import type { WeatherData } from '../Types/weather';
import { deriveAlerts } from './weatherAlerts';

function makeWeather(overrides: Partial<WeatherData> = {}): WeatherData {
  const base: WeatherData = {
    weather: [{ id: 800, main: 'Clear', description: 'céu limpo', icon: '01d' }],
    main: { temp: 25, feels_like: 26, temp_min: 22, temp_max: 28, pressure: 1013, humidity: 60 },
    wind: { speed: 5, deg: 180 },
    visibility: 10000,
    coord: { lat: -23.5, lon: -46.6 },
    sys: { sunrise: 1609459200, sunset: 1609502400, country: 'BR' },
    name: 'São Paulo',
    timezone: -10800,
  };
  return { ...base, ...overrides };
}

describe('deriveAlerts', () => {
  it('returns no alerts for clear weather', () => {
    const alerts = deriveAlerts(makeWeather(), 'metric');
    expect(alerts).toHaveLength(0);
  });

  it('returns thunderstorm alert for code 200', () => {
    const weather = makeWeather({ weather: [{ id: 200, main: 'Thunderstorm', description: 'trovoada', icon: '11d' }] });
    const alerts = deriveAlerts(weather, 'metric');
    expect(alerts.some(a => a.title.includes('Tempestade'))).toBe(true);
  });

  it('returns snow alert for code 600', () => {
    const weather = makeWeather({ weather: [{ id: 600, main: 'Snow', description: 'neve leve', icon: '13d' }] });
    const alerts = deriveAlerts(weather, 'metric');
    expect(alerts.some(a => a.title.includes('Neve'))).toBe(true);
  });

  it('returns wind alert for high speed', () => {
    const weather = makeWeather({ wind: { speed: 90, deg: 180 } });
    const alerts = deriveAlerts(weather, 'metric');
    expect(alerts.some(a => a.title.includes('Vento'))).toBe(true);
  });

  it('returns heat alert for high temperature', () => {
    const weather = makeWeather({ main: { temp: 45, feels_like: 50, temp_min: 40, temp_max: 46, pressure: 1013, humidity: 30 } });
    const alerts = deriveAlerts(weather, 'metric');
    expect(alerts.some(a => a.title.includes('Calor'))).toBe(true);
  });

  it('returns cold alert for low temperature', () => {
    const weather = makeWeather({ main: { temp: -20, feels_like: -25, temp_min: -22, temp_max: -15, pressure: 1013, humidity: 60 } });
    const alerts = deriveAlerts(weather, 'metric');
    expect(alerts.some(a => a.title.includes('Frio'))).toBe(true);
  });

  it('returns high humidity alert', () => {
    const weather = makeWeather({ main: { temp: 25, feels_like: 30, temp_min: 22, temp_max: 28, pressure: 1013, humidity: 96 } });
    const alerts = deriveAlerts(weather, 'metric');
    expect(alerts.some(a => a.title.includes('Umidade'))).toBe(true);
  });

  it('returns low visibility alert', () => {
    const weather = makeWeather({ visibility: 500 });
    const alerts = deriveAlerts(weather, 'metric');
    expect(alerts.some(a => a.title.includes('Visibilidade'))).toBe(true);
  });
});
