import { z } from 'zod';

export const siteIdParamsSchema = z.object({
  id: z.uuid('Некорректный идентификатор площадки'),
});
