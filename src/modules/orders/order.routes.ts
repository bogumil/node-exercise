import { Router } from 'express';
import { apiRoute } from '../../shared/http/api-route';
import { jsonResponse } from '../../shared/http/json-response';
import { errorResponseSchema } from '../../shared/schemas/error-response.schema';
import { createOrder } from './order.controller';
import { createOrderBodySchema, orderResponseSchema } from './order.schemas';

export const orderRoutes = Router();

orderRoutes.post(
  '/',
  ...apiRoute({
    method: 'post',
    path: '/api/orders',
    tags: ['Orders'],
    summary: 'Create order',
    schemas: {
      body: createOrderBodySchema,
    },
    responses: {
      201: jsonResponse('Created order', orderResponseSchema),
      400: jsonResponse('Validation error', errorResponseSchema),
    },
    handler: createOrder,
  }),
);
