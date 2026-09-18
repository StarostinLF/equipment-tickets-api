import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './middlewares/cors.js';
import { requestId } from './middlewares/requestId.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
import { apiRouter } from './routes/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const JSON_BODY_LIMIT = '100kb';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(requestId);
  app.use(requestLogger);
  app.use(helmet());
  app.use(corsMiddleware);
  app.use('/api', rateLimiter);
  app.use(express.json({ limit: JSON_BODY_LIMIT }));

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
