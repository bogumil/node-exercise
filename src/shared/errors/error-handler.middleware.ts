import type { ErrorRequestHandler } from 'express';
import { logger } from '../../config/logger';
import type { ErrorResponseDto } from '../schemas/error-response.schema';
import { AppError } from './http-errors';

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let response: ErrorResponseDto;

  if (err instanceof AppError) {
    response = {
      status: err.status,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    };
  } else if (isMalformedJsonError(err)) {
    response = {
      status: 400,
      message: 'Malformed JSON request body',
      errors: {
        body: ['Request body contains invalid JSON'],
      },
    };
  } else {
    logger.error(err);

    response = {
      status: 500,
      message: 'Internal server error',
    };
  }

  return res.status(response.status).send(response);
};

function isMalformedJsonError(err: unknown): boolean {
  if (!(err instanceof SyntaxError)) {
    return false;
  }

  return (
    'type' in err &&
    err.type === 'entity.parse.failed' &&
    (('status' in err && err.status === 400) || ('statusCode' in err && err.statusCode === 400))
  );
}
