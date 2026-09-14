import express from 'express';
import { requestId } from './middlewares/requestId.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { apiRouter } from './routes/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const JSON_BODY_LIMIT = '100kb';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  // Порядок middleware важен и сохраняется таким на всех следующих этапах:
  // 1. requestId — назначается первым, чтобы и логгер, и обработчик ошибок
  //    могли на него ссылаться;
  // 2. requestLogger — логирует каждый запрос вместе с его id;
  // 3. express.json — разбор тела с ограничением размера;
  // 4. роуты (внутри — валидация конкретного эндпоинта);
  // 5. notFoundHandler — единый формат 404 для несуществующих маршрутов;
  // 6. errorHandler — централизованная обработка всех ошибок, всегда последним.
  app.use(requestId);
  app.use(requestLogger);
  app.use(express.json({ limit: JSON_BODY_LIMIT }));

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
