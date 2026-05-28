import { Router } from 'express';
import { apiRoute } from '../../shared/http/api-route';
import { jsonResponse } from '../../shared/http/json-response';
import { errorResponseSchema } from '../../shared/schemas/error-response.schema';
import { uuidIdParamsSchema } from '../../shared/schemas/id.schema';
import { createOrder, deleteOrder, getOrder, listOrders, updateOrder } from './order.controller';
import {
  createOrderBodySchema,
  listOrderQuerySchema,
  orderResponseSchema,
  paginatedOrderResponseSchema,
  updateOrderBodySchema,
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

orderRoutes.get(
  '/:id',
  ...apiRoute({
    method: 'get',
    path: '/api/orders/{id}',
    tags: ['Orders'],
    summary: 'Get order by id',
    schemas: {
      params: uuidIdParamsSchema,
    },
    responses: {
      200: jsonResponse('Order', orderResponseSchema),
      400: jsonResponse('Validation error', errorResponseSchema),
      404: jsonResponse('Order not found', errorResponseSchema),
    },
    handler: getOrder,
  }),
);

orderRoutes.put(
  '/:id',
  ...apiRoute({
    method: 'put',
    path: '/api/orders/{id}',
    tags: ['Orders'],
    summary: 'Update order by id',
    schemas: {
      params: uuidIdParamsSchema,
      body: updateOrderBodySchema,
    },
    responses: {
      200: jsonResponse('Updated order', orderResponseSchema),
      400: jsonResponse('Validation error', errorResponseSchema),
      404: jsonResponse('Order not found', errorResponseSchema),
    },
    handler: updateOrder,
  }),
);

orderRoutes.delete(
  '/:id',
  ...apiRoute({
    method: 'delete',
    path: '/api/orders/{id}',
    tags: ['Orders'],
    summary: 'Delete order by id',
    schemas: {
      params: uuidIdParamsSchema,
    },
    responses: {
      204: { description: 'Order deleted' },
      400: jsonResponse('Validation error', errorResponseSchema),
      404: jsonResponse('Order not found', errorResponseSchema),
    },
    handler: deleteOrder,
  }),
);
