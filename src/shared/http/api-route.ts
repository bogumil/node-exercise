import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import type { ZodType } from 'zod';
import { openApiRegistry } from '../../openapi/registry';
import { validate } from '../validation/validate-request.middleware';

type RouteRequest = NonNullable<RouteConfig['request']>;
type OpenApiParameterSchema = NonNullable<RouteRequest['params']>;

type ApiRouteSchemas<TParams extends ParamsDictionary = ParamsDictionary, TBody = unknown, TQuery = Query> = {
  body?: ZodType<TBody>;
  params?: OpenApiParameterSchema & ZodType<TParams>;
  query?: OpenApiParameterSchema & ZodType<TQuery>;
};

type ApiRouteDefinition<
  TParams extends ParamsDictionary = ParamsDictionary,
  TBody = unknown,
  TQuery = Query,
> = {
  method: RouteConfig['method'];
  path: string;
  tags?: string[];
  summary?: string;
  schemas?: ApiRouteSchemas<TParams, TBody, TQuery>;
  responses: RouteConfig['responses'];
  handler: RequestHandler<TParams, unknown, TBody, TQuery>;
};

export function apiRoute<
  TParams extends ParamsDictionary = ParamsDictionary,
  TBody = unknown,
  TQuery = Query,
>(definition: ApiRouteDefinition<TParams, TBody, TQuery>): RequestHandler<TParams, unknown, TBody, TQuery>[] {
  const request: RouteRequest = {};
  const validationSchemas: Parameters<typeof validate<TParams, TBody, TQuery>>[0] = {};

  if (definition.schemas?.params) {
    request.params = definition.schemas.params;
    validationSchemas.params = definition.schemas.params;
  }

  if (definition.schemas?.query) {
    request.query = definition.schemas.query;
    validationSchemas.query = definition.schemas.query;
  }

  if (definition.schemas?.body) {
    request.body = {
      content: {
        'application/json': {
          schema: definition.schemas.body,
        },
      },
    };

    validationSchemas.body = definition.schemas.body;
  }

  openApiRegistry.registerPath({
    method: definition.method,
    path: definition.path,
    ...(definition.tags !== undefined ? { tags: definition.tags } : {}),
    ...(definition.summary !== undefined ? { summary: definition.summary } : {}),
    ...(Object.keys(request).length ? { request } : {}),
    responses: definition.responses,
  });

  return [validate(validationSchemas), definition.handler];
}
