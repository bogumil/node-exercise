import { Router } from 'express';
import { uuidIdParamsSchema } from '../../shared/common.schema';
import { validate } from '../../shared/validate-request.middleware';
import { createOrganization, getOrganization, listOrganizations } from './organization.controller';
import { createOrganizationBodySchema, listOrganizationQuerySchema } from './organization.schemas';

export const organizationRoutes = Router();

organizationRoutes.get('/', validate({ query: listOrganizationQuerySchema }), listOrganizations);

organizationRoutes.post('/', validate({ body: createOrganizationBodySchema }), createOrganization);

organizationRoutes.get('/:id', validate({ params: uuidIdParamsSchema }), getOrganization);
