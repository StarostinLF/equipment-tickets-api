import { Router } from 'express';
import { equipmentController } from '../controllers/equipmentController.js';
import { validate } from '../validators/validate.js';
import {
  createEquipmentSchema,
  updateEquipmentSchema,
  equipmentIdParamsSchema,
  listEquipmentQuerySchema,
} from '../validators/equipmentSchemas.js';

export const equipmentRouter = Router();

equipmentRouter.get(
  '/equipment',
  validate({ query: listEquipmentQuerySchema }),
  equipmentController.list,
);

equipmentRouter.post(
  '/equipment',
  validate({ body: createEquipmentSchema }),
  equipmentController.create,
);

equipmentRouter.get(
  '/equipment/:id',
  validate({ params: equipmentIdParamsSchema }),
  equipmentController.getById,
);

equipmentRouter.patch(
  '/equipment/:id',
  validate({ params: equipmentIdParamsSchema, body: updateEquipmentSchema }),
  equipmentController.update,
);

equipmentRouter.delete(
  '/equipment/:id',
  validate({ params: equipmentIdParamsSchema }),
  equipmentController.remove,
);

equipmentRouter.get(
  '/equipment/:id/weather',
  validate({ params: equipmentIdParamsSchema }),
  equipmentController.getWeather,
);
