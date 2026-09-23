import { z } from 'zod';

export function isoDate({ allowFuture = true } = {}) {
  let schema = z
    .string('Ожидается строка с датой')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Ожидается корректная ISO-дата');

  if (!allowFuture) {
    schema = schema.refine(
      (value) => new Date(value).getTime() <= Date.now(),
      'Дата не может быть в будущем',
    );
  }

  return schema;
}

export const paginationQuery = {
  page: z.coerce
    .number('Ожидается число')
    .int('Ожидается целое число')
    .min(1, 'Минимум 1')
    .max(10000, 'Максимум 10000')
    .default(1),
  limit: z.coerce
    .number('Ожидается число')
    .int('Ожидается целое число')
    .min(1, 'Минимум 1')
    .max(100, 'Максимум 100')
    .default(20),
};

export function nonEmpty(schema) {
  return schema.refine(
    (data) => Object.keys(data).length > 0,
    'Нужно передать хотя бы одно поле для обновления',
  );
}
