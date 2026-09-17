import { Router } from 'express';
import { healthRouter } from './healthRoutes.js';
import { equipmentRouter } from './equipmentRoutes.js';
import { requestRouter } from './requestRoutes.js';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(equipmentRouter);
apiRouter.use(requestRouter);
