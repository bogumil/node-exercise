import { Router } from 'express';
import { apiRoute } from '../../shared/api-route';
import { errorResponseSchema, uuidIdParamsSchema } from '../../shared/common.schema';
import { jsonResponse } from '../../shared/json-response';
import { createOrganization, getOrganization, listOrganizations } from './organization.controller';
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
