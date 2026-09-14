import { Router } from 'express';
import { healthRouter } from './healthRoutes.js';

export const apiRouter = Router();

apiRouter.use(healthRouter);

// Роуты equipment и requests подключаются здесь по мере реализации CRUD.
