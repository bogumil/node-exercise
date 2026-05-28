import type { ErrorRequestHandler } from 'express';
import type { ErrorResponseDto } from '../schemas/error-response.schema';
import { AppError } from './http-errors';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let response: ErrorResponseDto | undefined;

  if (err instanceof AppError) {
    response = {
      status: err.status,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    };
  }

  console.error(err);

  if (!response) {
    response = {
      status: 500,
      message: 'Internal server error',
    };
  }

  return res.status(response.status).send(response);
};
