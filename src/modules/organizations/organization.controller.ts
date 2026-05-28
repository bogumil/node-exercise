import type { Request, Response } from 'express';
import type { UuidIdParamsSchema } from '../../shared/schemas/id.schema';
import type { CreateOrganizationBodyDto, ListOrganizationQueryDto } from './organization.schemas';
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

export async function listOrganizations(
  _req: Request<unknown, unknown, unknown, ListOrganizationQueryDto>,
  res: Response,
) {
  const result = await organizationService.list(res.locals.query);
  return res.status(200).json(result);
}
