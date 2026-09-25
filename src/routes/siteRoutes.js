import { Router } from 'express';
import { siteController } from '../controllers/siteController.js';
import { validate } from '../validators/validate.js';
import { siteIdParamsSchema } from '../validators/siteSchemas.js';

export const siteRouter = Router();

siteRouter.get('/sites', siteController.list);

siteRouter.get(
  '/sites/:id/summary',
  validate({ params: siteIdParamsSchema }),
  siteController.getSummary,
);
