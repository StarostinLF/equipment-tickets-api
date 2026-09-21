import process from 'node:process';

function parseOrigins(value) {
  if (!value) return [];
  return value.split(',').map((origin) => origin.trim()).filter(Boolean);
}

function parseIntEnv(value, fallback) {
  if (value === undefined || value === '') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Некорректное числовое значение переменной окружения: "${value}"`);
  }
  return parsed;
}

export const env = {
  port: parseIntEnv(process.env.PORT, 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),
  rateLimitWindowMs: parseIntEnv(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  rateLimitMax: parseIntEnv(process.env.RATE_LIMIT_MAX, 100),
  weatherApiUrl: process.env.WEATHER_API_URL ?? 'https://api.open-meteo.com/v1/forecast',
  requestTimeoutMs: parseIntEnv(process.env.REQUEST_TIMEOUT_MS, 5000),
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseIntEnv(process.env.DB_PORT, 5432),
    name: process.env.DB_NAME ?? 'equipment_tickets',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    poolMin: parseIntEnv(process.env.DB_POOL_MIN, 0),
    poolMax: parseIntEnv(process.env.DB_POOL_MAX, 5),
  },
};

export const isProduction = env.nodeEnv === 'production';
export const isTest = env.nodeEnv === 'test';
