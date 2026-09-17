import { z } from 'zod';
import { isoDate, paginationQuery } from './common.js';

export const REQUEST_PRIORITIES = ['low', 'medium', 'high', 'critical'];
export const REQUEST_STATUSES = ['new', 'in_progress', 'done', 'rejected'];

export const createRequestSchema = z.object({
  equipmentId: z.uuid('Некорректный идентификатор оборудования'),
  title: z.string().trim().min(5).max(120),
  description: z.string().max(2000).optional(),
  priority: z.enum(REQUEST_PRIORITIES),
  plannedAt: isoDate().optional(),
});

export const updateRequestSchema = createRequestSchema.partial();

export const updateRequestStatusSchema = z.object({
  status: z.enum(REQUEST_STATUSES),
});

export const requestIdParamsSchema = z.object({
  id: z.uuid('Некорректный идентификатор заявки'),
});

export const listRequestsQuerySchema = z.object({
  status: z.enum(REQUEST_STATUSES).optional(),
  priority: z.enum(REQUEST_PRIORITIES).optional(),
  equipmentId: z.uuid().optional(),
  createdFrom: isoDate().optional(),
  createdTo: isoDate().optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'priority', 'plannedAt', 'status']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  ...paginationQuery,
});

export const listRequestsByEquipmentQuerySchema = z.object({
  status: z.enum(REQUEST_STATUSES).optional(),
  priority: z.enum(REQUEST_PRIORITIES).optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'priority', 'plannedAt', 'status']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  ...paginationQuery,
});
