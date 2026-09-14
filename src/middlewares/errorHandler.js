import { AppError } from '../errors/index.js';
import { isProduction } from '../config/env.js';

// Сигнатура из 4 аргументов обязательна для Express — так он отличает
// error-handling middleware от обычного, даже если next() здесь не вызывается.
export function errorHandler(err, req, res, next) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : 'INTERNAL_ERROR';
  const message = isAppError || !isProduction ? err.message : 'Внутренняя ошибка сервера';

  if (statusCode >= 500) {
    req.log?.error({ err }, 'Необработанная ошибка запроса');
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(isAppError && err.details ? { details: err.details } : {}),
      requestId: req.id,
    },
  });
}
