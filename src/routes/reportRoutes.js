import { Router } from 'express';
import { reportController } from '../controllers/reportController.js';
import { validate } from '../validators/validate.js';
import { equipmentLoadReportQuerySchema } from '../validators/reportSchemas.js';

export const reportRouter = Router();

reportRouter.get(
  '/reports/equipment-load',
  validate({ query: equipmentLoadReportQuerySchema }),
  reportController.getEquipmentLoad,
);
