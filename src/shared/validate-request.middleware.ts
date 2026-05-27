import type { RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import type { ZodType } from 'zod';
import { ValidationError } from './http-errors';
import { mapZodErrorToFieldErrors } from './zod-error.mapper';

type ValidationSchemas = {
  body?: ZodType;
  params?: ZodType<ParamsDictionary>;
  query?: ZodType<Query>;
};

export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req, _res, next) => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);

      if (!result.success) {
        const errors = mapZodErrorToFieldErrors(result.error);
        return next(new ValidationError(errors));
      }

      req.body = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        const errors = mapZodErrorToFieldErrors(result.error);
        return next(new ValidationError(errors));
      }
      req.params = result.data;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);

      if (!result.success) {
        const errors = mapZodErrorToFieldErrors(result.error);
        return next(new ValidationError(errors));
      }

      req.query = result.data;
    }

    next();
  };
}
