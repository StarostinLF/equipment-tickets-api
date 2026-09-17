import { z } from 'zod';

export function isoDate({ allowFuture = true } = {}) {
  let schema = z.string().refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: 'Ожидается корректная ISO-дата',
  });

  if (!allowFuture) {
    schema = schema.refine((value) => new Date(value).getTime() <= Date.now(), {
      message: 'Дата не может быть в будущем',
    });
  }

  return schema;
}

export const paginationQuery = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
};
