import type { Request, Response } from 'express';
import type { CreateOrganizationBodyDto } from './organization.schemas';
import { organizationService } from './organization.service';

export async function createOrganization(
  req: Request<unknown, unknown, CreateOrganizationBodyDto>,
  res: Response,
) {
  const organization = await organizationService.create(req.body);
  return res.status(201).json(organization);
}
