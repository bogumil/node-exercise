import { Router } from 'express';
import { apiRoute } from '../../shared/http/api-route';
import { jsonResponse } from '../../shared/http/json-response';
import { errorResponseSchema } from '../../shared/schemas/error-response.schema';
import { uuidIdParamsSchema } from '../../shared/schemas/id.schema';
import { createUser, deleteUser, getUser, listUsers, updateUser } from './user.controller';
import {
  createUserBodySchema,
  listUserQuerySchema,
  paginatedUserResponseSchema,
  updateUserBodySchema,
  userResponseSchema,
} from './user.schemas';

export const userRoutes = Router();

userRoutes.get(
  '/',
  ...apiRoute({
    method: 'get',
    path: '/api/users',
    tags: ['Users'],
    summary: 'Get users list',
    schemas: {
      query: listUserQuerySchema,
    },
    responses: {
      200: jsonResponse('Paginated users list', paginatedUserResponseSchema),
      400: jsonResponse('Validation error', errorResponseSchema),
    },
    handler: listUsers,
  }),
);

userRoutes.get(
  '/:id',
  ...apiRoute({
    method: 'get',
    path: '/api/users/{id}',
    tags: ['Users'],
    summary: 'Get user by id',
    schemas: {
      params: uuidIdParamsSchema,
    },
    responses: {
      200: jsonResponse('User', userResponseSchema),
      400: jsonResponse('Validation error', errorResponseSchema),
      404: jsonResponse('User not found', errorResponseSchema),
    },
    handler: getUser,
  }),
);

userRoutes.post(
  '/',
  ...apiRoute({
    method: 'post',
    path: '/api/users',
    tags: ['Users'],
    summary: 'Create user',
    schemas: {
      body: createUserBodySchema,
    },
    responses: {
      201: jsonResponse('Created user', userResponseSchema),
      400: jsonResponse('Validation error', errorResponseSchema),
    },
    handler: createUser,
  }),
);

userRoutes.put(
  '/:id',
  ...apiRoute({
    method: 'put',
    path: '/api/users/{id}',
    tags: ['Users'],
    summary: 'Update user by id',
    schemas: {
      params: uuidIdParamsSchema,
      body: updateUserBodySchema,
    },
    responses: {
      200: jsonResponse('Updated user', userResponseSchema),
      400: jsonResponse('Validation error', errorResponseSchema),
      404: jsonResponse('User not found', errorResponseSchema),
    },
    handler: updateUser,
  }),
);

userRoutes.delete(
  '/:id',
  ...apiRoute({
    method: 'delete',
    path: '/api/users/{id}',
    tags: ['Users'],
    summary: 'Delete user by id',
    schemas: {
      params: uuidIdParamsSchema,
    },
    responses: {
      204: { description: 'User deleted' },
      400: jsonResponse('Validation error', errorResponseSchema),
      404: jsonResponse('User not found', errorResponseSchema),
    },
    handler: deleteUser,
  }),
);
