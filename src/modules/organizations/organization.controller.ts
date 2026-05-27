import type { Request, Response } from 'express';
import type { UuidIdParamsSchema } from '../../shared/common.schema';
import type { CreateOrganizationBodyDto } from './organization.schemas';
import { organizationService } from './organization.service';

export async function createOrganization(
  req: Request<unknown, unknown, CreateOrganizationBodyDto>,
  res: Response,
) {
  const organization = await organizationService.create(req.body);
  return res.status(201).json(organization);
}

export async function getOrganization(req: Request<UuidIdParamsSchema>, res: Response) {
  const organization = await organizationService.findById(req.params.id);
  return res.status(200).json(organization);
}
