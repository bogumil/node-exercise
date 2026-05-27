import { z } from 'zod';

export const createOrganizationBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name must contain at least 1 character')
      .max(100, `Name must contain at most 100 characters`),
    industry: z.string().trim().max(50, `Industry must contain at most 50 characters`).optional(),
    dateFounded: z.iso.date('Date has to be in format YYYY-MM-DD').optional(),
  })
  .strict();

export type CreateOrganizationBodyDto = z.infer<typeof createOrganizationBodySchema>;
