export class AppError extends Error {
  constructor(message, { statusCode = 500, code = 'INTERNAL_ERROR', details } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Некорректные данные запроса', details) {
    super(message, { statusCode: 422, code: 'VALIDATION_ERROR', details });
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Ресурс не найден', details) {
    super(message, { statusCode: 404, code: 'NOT_FOUND', details });
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Конфликт состояния ресурса', details) {
    super(message, { statusCode: 409, code: 'CONFLICT', details });
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = 'Внешний сервис недоступен', details) {
    super(message, { statusCode: 502, code: 'EXTERNAL_SERVICE_ERROR', details });
  }
}
