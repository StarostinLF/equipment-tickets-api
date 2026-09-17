import { z } from 'zod';
import { isoDate, paginationQuery } from './common.js';

export const EQUIPMENT_TYPES = ['turbine', 'inverter', 'sensor', 'substation'];
export const EQUIPMENT_STATUSES = ['operational', 'maintenance', 'fault', 'decommissioned'];

const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

export const createEquipmentSchema = z.object({
  name: z.string().trim().min(3).max(100),
  type: z.enum(EQUIPMENT_TYPES),
  serialNumber: z.string().trim().min(1, 'Серийный номер обязателен'),
  location: locationSchema,
  status: z.enum(EQUIPMENT_STATUSES),
  installedAt: isoDate({ allowFuture: false }),
});

export const updateEquipmentSchema = createEquipmentSchema.partial();

export const equipmentIdParamsSchema = z.object({
  id: z.uuid('Некорректный идентификатор оборудования'),
});

export const listEquipmentQuerySchema = z.object({
  type: z.enum(EQUIPMENT_TYPES).optional(),
  status: z.enum(EQUIPMENT_STATUSES).optional(),
  sort: z.enum(['name', 'installedAt', 'status', 'type']).default('installedAt'),
  order: z.enum(['asc', 'desc']).default('asc'),
  ...paginationQuery,
});
