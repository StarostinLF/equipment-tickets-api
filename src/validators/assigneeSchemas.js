import { z } from 'zod';
import { ASSIGNEE_ROLES } from '../db/models/requestAssignee.js';

const assigneeItemSchema = z.object({
  technicianId: z.uuid('Некорректный идентификатор специалиста'),
  role: z.enum(ASSIGNEE_ROLES, 'Недопустимая роль'),
  plannedHours: z.number('Ожидается число').positive('Должно быть больше 0'),
});

export const assignTeamSchema = z.object({
  assignees: z.array(assigneeItemSchema).min(1, 'Нужен хотя бы один специалист'),
});

export const removeAssigneeParamsSchema = z.object({
  id: z.uuid('Некорректный идентификатор заявки'),
  userId: z.uuid('Некорректный идентификатор специалиста'),
});
