import cors from 'cors';
import { env } from '../config/env.js';
import { ForbiddenError } from '../errors/index.js';

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new ForbiddenError(`Источник ${origin} не разрешён политикой CORS`));
  },
});
