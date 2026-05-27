import { Router } from 'express';
import { uuidIdParamsSchema } from '../../shared/common.schema';
import { validate } from '../../shared/validate-request.middleware';
import { createOrganization, getOrganization } from './organization.controller';
import { createOrganizationBodySchema } from './organization.schemas';

export const organizationRoutes = Router();

organizationRoutes.get('/', (_req, res) => {
  res.status(200).json({
    status: 'success',
  });
});

organizationRoutes.post('/', validate({ body: createOrganizationBodySchema }), createOrganization);

organizationRoutes.get('/:id', validate({ params: uuidIdParamsSchema }), getOrganization);
