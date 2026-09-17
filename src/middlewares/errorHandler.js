import { AppError } from '../errors/index.js';
import { isProduction } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  const isAppError = err instanceof AppError;

  const parserStatus = !isAppError && typeof err.status === 'number' && err.status >= 400 && err.status < 500
    ? err.status
    : undefined;

  const statusCode = isAppError ? err.statusCode : parserStatus ?? 500;
  const code = isAppError ? err.code : parserStatus === 400 ? 'BAD_REQUEST' : 'INTERNAL_ERROR';

  let message;
  if (isAppError) {
    message = err.message;
  } else if (parserStatus === 400) {
    message = 'Некорректный JSON в теле запроса';
  } else {
    message = isProduction ? 'Внутренняя ошибка сервера' : err.message;
  }

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
