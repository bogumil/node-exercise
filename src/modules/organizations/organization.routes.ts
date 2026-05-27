import { Router } from 'express';
import { validate } from '../../shared/validate-request.middleware';
import { createOrganizationBodySchema } from './organization.schemas';

export const organizationRoutes = Router();

organizationRoutes.get('/', (_req, res) => {
  res.status(200).json({
    status: 'success',
  });
});

organizationRoutes.post('/', validate({ body: createOrganizationBodySchema }), (_req, res) => {
  return res.status(201).json({
    organizationCreate: true,
  });
});
