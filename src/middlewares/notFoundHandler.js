import { NotFoundError } from '../errors/index.js';

export function notFoundHandler(req, res, next) {
  next(new NotFoundError(`Маршрут не найден: ${req.method} ${req.originalUrl}`));
}
