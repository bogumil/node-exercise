import { Router } from 'express';
import { apiRoute } from '../../shared/http/api-route';
import { jsonResponse } from '../../shared/http/json-response';
import { errorResponseSchema } from '../../shared/schemas/error-response.schema';
import { createOrder, listOrders } from './order.controller';
import {
  createOrderBodySchema,
  listOrderQuerySchema,
  orderResponseSchema,
  paginatedOrderResponseSchema,
} from './order.schemas';

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

orderRoutes.get(
  '/',
  ...apiRoute({
    method: 'get',
    path: '/api/orders',
    tags: ['Orders'],
    summary: 'Get orders list',
    schemas: {
      query: listOrderQuerySchema,
    },
    responses: {
      200: jsonResponse('Paginated orders list', paginatedOrderResponseSchema),
      400: jsonResponse('Validation error', errorResponseSchema),
    },
    handler: listOrders,
  }),
);
