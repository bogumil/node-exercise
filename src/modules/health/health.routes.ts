import { Router } from 'express';
import { apiRoute } from '../../shared/http/api-route';
import { jsonResponse } from '../../shared/http/json-response';
import { getHealth, getReadiness } from './health.controller';
import { healthResponseSchema, readinessResponseSchema } from './health.schemas';

export const healthRoutes = Router();

healthRoutes.get(
  '/health',
  ...apiRoute({
    method: 'get',
    path: '/health',
    tags: ['Health'],
    summary: 'Liveness probe',
    responses: {
      200: jsonResponse('Service is alive', healthResponseSchema),
    },
    handler: getHealth,
  }),
);

healthRoutes.get(
  '/readiness',
  ...apiRoute({
    method: 'get',
    path: '/readiness',
    tags: ['Health'],
    summary: 'Readiness probe',
    responses: {
      200: jsonResponse('Service is ready', readinessResponseSchema),
      503: jsonResponse('Service is not ready', readinessResponseSchema),
    },
    handler: getReadiness,
  }),
);
