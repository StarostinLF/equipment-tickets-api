import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { TooManyRequestsError } from '../errors/index.js';

export const rateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new TooManyRequestsError());
  },
});
