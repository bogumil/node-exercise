import type { RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import type { ZodType } from 'zod';
import { ValidationError } from './http-errors';
import { mapZodErrorToFieldErrors } from './zod-error.mapper';

type ValidationSchemas<
  TParams extends ParamsDictionary = ParamsDictionary,
  TBody = unknown,
  TQuery = Query,
> = {
  body?: ZodType<TBody>;
  params?: ZodType<TParams>;
  query?: ZodType<TQuery>;
};

export function validate<
  TParams extends ParamsDictionary = ParamsDictionary,
  TBody = unknown,
  TQuery = Query,
>(schemas: ValidationSchemas<TParams, TBody, TQuery>): RequestHandler<TParams, unknown, TBody, TQuery> {
  return (req, res, next) => {
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

      //req.query = result.data; // Can't assign to req.query, because it is a getter only
      // todo - improve through additional property on req
      res.locals.query = result.data;
    }

    next();
  };
}
