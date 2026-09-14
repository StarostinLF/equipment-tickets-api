import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (req, res) => {
  res.json({ data: { status: 'ok', uptime: process.uptime() } });
});
