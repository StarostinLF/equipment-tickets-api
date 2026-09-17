import { ValidationError } from '../errors/index.js';

function formatIssues(zodError) {
  return zodError.issues.map((issue) => ({
    field: issue.path.join('.') || '(root)',
    message: issue.message,
  }));
}

/**
 * Универсальный middleware валидации.
 * req.query — геттер в Express 5 и не может быть переприсвоен,
 * поэтому провалидированные query-параметры кладутся в req.validatedQuery,
 * а не заменяют req.query.
 */
export function validate({ body, params, query } = {}) {
  return (req, res, next) => {
    const details = [];

    if (body) {
      const result = body.safeParse(req.body);
      if (result.success) {
        req.body = result.data;
      } else {
        details.push(...formatIssues(result.error));
      }
    }

    if (params) {
      const result = params.safeParse(req.params);
      if (result.success) {
        req.params = result.data;
      } else {
        details.push(...formatIssues(result.error));
      }
    }

    if (query) {
      const result = query.safeParse(req.query);
      if (result.success) {
        req.validatedQuery = result.data;
      } else {
        details.push(...formatIssues(result.error));
      }
    }

    if (details.length > 0) {
      return next(new ValidationError('Некорректные данные запроса', details));
    }

    next();
  };
}
