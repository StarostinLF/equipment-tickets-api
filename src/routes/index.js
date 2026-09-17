import { Router } from 'express';
import { healthRouter } from './healthRoutes.js';
import { equipmentRouter } from './equipmentRoutes.js';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(equipmentRouter);

// Роуты requests подключатся здесь в ветке feat/requests-crud.
