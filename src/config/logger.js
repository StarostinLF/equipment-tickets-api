import pino from 'pino';
import { isProduction, isTest } from './env.js';

export const logger = pino({
  level: isProduction ? 'info' : 'debug',
  enabled: !isTest,
  transport: isProduction ? undefined : { target: 'pino-pretty', options: { colorize: true } },
});
