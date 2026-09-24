import { Router } from 'express';
import { healthRouter } from './healthRoutes.js';
import { equipmentRouter } from './equipmentRoutes.js';
import { requestRouter } from './requestRoutes.js';
import { siteRouter } from './siteRoutes.js';
import { reportRouter } from './reportRoutes.js';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(equipmentRouter);
apiRouter.use(requestRouter);
apiRouter.use(siteRouter);
apiRouter.use(reportRouter);
