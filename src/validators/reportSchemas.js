import { z } from 'zod';
import { isoDate } from './common.js';

export const equipmentLoadReportQuerySchema = z.object({
  createdFrom: isoDate().optional(),
  createdTo: isoDate().optional(),
  minRequests: z.coerce
    .number('Ожидается число')
    .int('Ожидается целое число')
    .min(0, 'Минимум 0')
    .max(10000, 'Максимум 10000')
    .default(0),
});
