import { z } from 'zod';
import { isoDate, paginationQuery, nonEmpty } from './common.js';

export const REQUEST_PRIORITIES = ['low', 'medium', 'high', 'critical'];
export const REQUEST_STATUSES = ['new', 'in_progress', 'done', 'rejected'];

export const createRequestSchema = z.object(
  {
    equipmentId: z.uuid('Некорректный идентификатор оборудования'),
    title: z.string('Ожидается строка').trim().min(5, 'Минимум 5 символов').max(120, 'Максимум 120 символов'),
    description: z.string('Ожидается строка').max(2000, 'Максимум 2000 символов').optional(),
    priority: z.enum(REQUEST_PRIORITIES, 'Недопустимый приоритет'),
    plannedAt: isoDate().optional(),
  },
  'Ожидается объект JSON',
);

export const updateRequestSchema = nonEmpty(createRequestSchema.partial());

export const updateRequestStatusSchema = z.object({
  status: z.enum(REQUEST_STATUSES, 'Недопустимый статус заявки'),
});

export const requestIdParamsSchema = z.object({
  id: z.uuid('Некорректный идентификатор заявки'),
});

export const listRequestsQuerySchema = z.object({
  status: z.enum(REQUEST_STATUSES, 'Недопустимый статус заявки').optional(),
  priority: z.enum(REQUEST_PRIORITIES, 'Недопустимый приоритет').optional(),
  equipmentId: z.uuid('Некорректный идентификатор оборудования').optional(),
  createdFrom: isoDate().optional(),
  createdTo: isoDate().optional(),
  sort: z
    .enum(['createdAt', 'updatedAt', 'priority', 'plannedAt', 'status'], 'Недопустимое поле сортировки')
    .default('createdAt'),
  order: z.enum(['asc', 'desc'], 'Недопустимое направление сортировки').default('desc'),
  ...paginationQuery,
});

export const listRequestsByEquipmentQuerySchema = z.object({
  status: z.enum(REQUEST_STATUSES, 'Недопустимый статус заявки').optional(),
  priority: z.enum(REQUEST_PRIORITIES, 'Недопустимый приоритет').optional(),
  sort: z
    .enum(['createdAt', 'updatedAt', 'priority', 'plannedAt', 'status'], 'Недопустимое поле сортировки')
    .default('createdAt'),
  order: z.enum(['asc', 'desc'], 'Недопустимое направление сортировки').default('desc'),
  ...paginationQuery,
});
