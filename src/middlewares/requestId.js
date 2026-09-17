import { randomUUID } from 'node:crypto';

export function requestId(req, res, next) {
  const incoming = req.headers['x-request-id'];
  req.id = typeof incoming === 'string' && incoming.trim() ? incoming.trim() : randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
}
