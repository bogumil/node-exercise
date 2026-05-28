export class AppError extends Error {
  public readonly status: number;
  public readonly errors?: Record<string, string[]>;

  constructor(params: {
    status: number;
    message: string;
    errors?: Record<string, string[]> | undefined;
  }) {
    super(params.message);

    this.status = params.status;
    if (params.errors) {
      this.errors = params.errors;
    }
  }
}

export class ValidationError extends AppError {
  constructor(errors: Record<string, string[]>, message = 'Validation failed') {
    super({
      status: 400,
      message,
      ...(errors ? { errors } : {}),
    });
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super({
      status: 404,
      message,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', errors?: Record<string, string[]>) {
    super({
      status: 409,
      message,
      ...(errors ? { errors } : {}),
    });
  }
}
