import { z } from 'zod';
import { isoDate, paginationQuery, nonEmpty } from './common.js';

export const EQUIPMENT_TYPES = ['turbine', 'inverter', 'sensor', 'substation'];
export const EQUIPMENT_STATUSES = ['operational', 'maintenance', 'fault', 'decommissioned'];

const locationSchema = z.object(
  {
    lat: z.number('Ожидается число').min(-90, 'Минимум -90').max(90, 'Максимум 90'),
    lon: z.number('Ожидается число').min(-180, 'Минимум -180').max(180, 'Максимум 180'),
  },
  'Ожидается объект { lat, lon }',
);

export const createEquipmentSchema = z.object(
  {
    siteId: z.uuid('Некорректный идентификатор площадки'),
    name: z.string('Ожидается строка').trim().min(3, 'Минимум 3 символа').max(100, 'Максимум 100 символов'),
    type: z.enum(EQUIPMENT_TYPES, 'Недопустимый тип оборудования'),
    serialNumber: z.string('Ожидается строка').trim().min(1, 'Серийный номер обязателен'),
    location: locationSchema,
    status: z.enum(EQUIPMENT_STATUSES, 'Недопустимый статус оборудования'),
    installedAt: isoDate({ allowFuture: false }),
  },
  'Ожидается объект JSON',
);

export const updateEquipmentSchema = nonEmpty(createEquipmentSchema.partial());

export const equipmentIdParamsSchema = z.object({
  id: z.uuid('Некорректный идентификатор оборудования'),
});

export const listEquipmentQuerySchema = z.object({
  type: z.enum(EQUIPMENT_TYPES, 'Недопустимый тип оборудования').optional(),
  status: z.enum(EQUIPMENT_STATUSES, 'Недопустимый статус оборудования').optional(),
  sort: z.enum(['name', 'installedAt', 'status', 'type'], 'Недопустимое поле сортировки').default('installedAt'),
  order: z.enum(['asc', 'desc'], 'Недопустимое направление сортировки').default('asc'),
  ...paginationQuery,
});
