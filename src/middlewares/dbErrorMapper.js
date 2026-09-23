import { ConflictError, NotFoundError } from '../errors/index.js';

const PG_UNIQUE_VIOLATION = '23505';
const PG_FOREIGN_KEY_VIOLATION = '23503';
const PG_RESTRICT_VIOLATION = '23001';

function pgCode(err) {
  return err.parent?.code ?? err.original?.code;
}

function toCamelCase(value) {
  return value.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function uniqueConstraintDetails(err) {
  const fields = err.fields ? Object.keys(err.fields) : (err.errors?.map((item) => item.path) ?? []);
  return fields.map((field) => ({
    field: toCamelCase(field),
    message: 'Значение должно быть уникальным',
  }));
}

export function dbErrorMapper(err, req, res, next) {
  const code = pgCode(err);

  if (code === PG_UNIQUE_VIOLATION) {
    return next(new ConflictError('Значение должно быть уникальным', uniqueConstraintDetails(err)));
  }

  if (code === PG_RESTRICT_VIOLATION) {
    return next(new ConflictError('Запись используется в связанных данных и не может быть удалена'));
  }

  if (code === PG_FOREIGN_KEY_VIOLATION) {
    return next(new NotFoundError('Связанная запись не найдена'));
  }

  next(err);
}
