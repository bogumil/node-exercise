import { Router } from 'express';
import { apiRoute } from '../../shared/http/api-route';
import { jsonResponse } from '../../shared/http/json-response';
import { errorResponseSchema } from '../../shared/schemas/error-response.schema';
import { uuidIdParamsSchema } from '../../shared/schemas/id.schema';
import {
  createOrganization,
  deleteOrganization,
  getOrganization,
  listOrganizations,
} from './organization.controller';
import {
  createOrganizationBodySchema,
  listOrganizationQuerySchema,
  organizationResponseSchema,
  paginatedOrganizationResponseSchema,
} from './organization.schemas';

export const organizationRoutes = Router();

organizationRoutes.get(
  '/',
  ...apiRoute({
    method: 'get',
    path: '/api/organizations',
    tags: ['Organizations'],
    summary: 'Get organizations list',
    schemas: {
      query: listOrganizationQuerySchema,
    },
    responses: {
      200: jsonResponse('Paginated organizations list', paginatedOrganizationResponseSchema),
      404: jsonResponse('Validation error', errorResponseSchema),
    },
    handler: listOrganizations,
  }),
);

organizationRoutes.get(
  '/:id',
  ...apiRoute({
    method: 'get',
    path: '/api/organizations/{id}',
    tags: ['Organizations'],
    summary: 'Get organization by id',
    schemas: {
      params: uuidIdParamsSchema,
    },
    responses: {
      200: jsonResponse('Organization', organizationResponseSchema),
      404: jsonResponse('Organization not found', errorResponseSchema),
    },
    handler: getOrganization,
  }),
);

organizationRoutes.post(
  '/',
  ...apiRoute({
    method: 'post',
    path: '/api/organizations',
    tags: ['Organizations'],
    summary: 'Create organization',
    schemas: {
      body: createOrganizationBodySchema,
    },
    responses: {
      201: jsonResponse('Created organization', organizationResponseSchema),
      404: jsonResponse('Validation error', errorResponseSchema),
    },
    handler: createOrganization,
  }),
);

//organizationRoutes.put('/:id');

organizationRoutes.delete(
  '/:id',
  ...apiRoute({
    method: 'delete',
    path: '/api/organizations/{id}',
    tags: ['Organizations'],
    summary: 'Delete organization by id',
    schemas: {
      params: uuidIdParamsSchema,
    },
    responses: {
      204: { description: 'Organization deleted' },
      400: jsonResponse('Validation error', errorResponseSchema),
      404: jsonResponse('Organization not found', errorResponseSchema),
    },
    handler: deleteOrganization,
  }),
);
