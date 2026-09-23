import { Router } from 'express';
import { requestController } from '../controllers/requestController.js';
import { validate } from '../validators/validate.js';
import {
  createRequestSchema,
  updateRequestSchema,
  updateRequestStatusSchema,
  requestIdParamsSchema,
  listRequestsQuerySchema,
  listRequestsByEquipmentQuerySchema,
} from '../validators/requestSchemas.js';
import { equipmentIdParamsSchema } from '../validators/equipmentSchemas.js';

export const requestRouter = Router();

requestRouter.get(
  '/requests',
  validate({ query: listRequestsQuerySchema }),
  requestController.list,
);

requestRouter.post(
  '/requests',
  validate({ body: createRequestSchema }),
  requestController.create,
);

requestRouter.get(
  '/requests/:id',
  validate({ params: requestIdParamsSchema }),
  requestController.getById,
);

requestRouter.patch(
  '/requests/:id',
  validate({ params: requestIdParamsSchema, body: updateRequestSchema }),
  requestController.update,
);

requestRouter.patch(
  '/requests/:id/status',
  validate({ params: requestIdParamsSchema, body: updateRequestStatusSchema }),
  requestController.updateStatus,
);

requestRouter.get(
  '/requests/:id/history',
  validate({ params: requestIdParamsSchema }),
  requestController.getHistory,
);

requestRouter.delete(
  '/requests/:id',
  validate({ params: requestIdParamsSchema }),
  requestController.remove,
);

requestRouter.get(
  '/equipment/:id/requests',
  validate({ params: equipmentIdParamsSchema, query: listRequestsByEquipmentQuerySchema }),
  requestController.listByEquipment,
);
