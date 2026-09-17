import { env } from '../config/env.js';
import { ExternalServiceError } from '../errors/index.js';

const MAX_PRECIPITATION_MM = 0;
const MAX_WIND_SPEED_KMH = 30;

async function fetchCurrentWeather(lat, lon) {
  const url = new URL(env.weatherApiUrl);
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current', 'precipitation,wind_speed_10m');
  url.searchParams.set('wind_speed_unit', 'kmh');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.requestTimeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`погодное API вернуло статус ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export const weatherService = {
  async getForecast({ lat, lon }) {
    let payload;
    try {
      payload = await fetchCurrentWeather(lat, lon);
    } catch {
      throw new ExternalServiceError(
        'Не удалось получить прогноз погоды: внешний сервис недоступен или не ответил вовремя',
      );
    }

    const current = payload.current ?? {};
    const precipitationMm = current.precipitation ?? 0;
    const windSpeedKmh = current.wind_speed_10m ?? 0;
    const outdoorWorkSuitable = precipitationMm <= MAX_PRECIPITATION_MM && windSpeedKmh < MAX_WIND_SPEED_KMH;

    return {
      observedAt: current.time ?? null,
      precipitationMm,
      windSpeedKmh,
      outdoorWorkSuitable,
      suitabilityRule: {
        maxPrecipitationMm: MAX_PRECIPITATION_MM,
        maxWindSpeedKmh: MAX_WIND_SPEED_KMH,
      },
    };
  },
};
