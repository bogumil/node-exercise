import { z } from 'zod';
import { createPaginationQuerySchema, createPaginationResponseSchema } from '../../shared/common.schema';

export const createOrganizationBodySchema = z
  .strictObject({
    name: z
      .string()
      .trim()
      .min(1, 'Name must contain at least 1 character')
      .max(100, `Name must contain at most 100 characters`),
    industry: z.string().trim().max(50, `Industry must contain at most 50 characters`).optional(),
    dateFounded: z.iso.date('Date has to be in format YYYY-MM-DD').optional(),
  })
  .openapi('CreateOrganizationRequest');

export type CreateOrganizationBodyDto = z.infer<typeof createOrganizationBodySchema>;

export const organizationResponseSchema = z
  .strictObject({
    id: z.uuid(),
    name: z.string(),
    industry: z.string().nullable(),
    dateFounded: z.string().nullable(),
  })
  .openapi('OrganizationResponse');
export type OrganizationResponseDto = z.infer<typeof organizationResponseSchema>;

export const organizationSortFields = ['name', 'industry'] as const;
export const listOrganizationQuerySchema = createPaginationQuerySchema(organizationSortFields);
export type ListOrganizationQueryDto = z.infer<typeof listOrganizationQuerySchema>;

export const paginatedOrganizationResponseSchema = createPaginationResponseSchema(
  'PaginatedOrganizationResponse',
  organizationResponseSchema,
);
