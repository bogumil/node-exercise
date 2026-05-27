import { z } from 'zod';
import { SORT_DIRECTIONS } from './pagination.types';

export const uuidIdParamsSchema = z.strictObject({
  id: z.uuidv4('Invalid id'),
});

export type UuidIdParamsSchema = z.infer<typeof uuidIdParamsSchema>;

export function createPaginationQuerySchema<const TSortFields extends readonly [string, ...string[]]>(
  sortableFields: TSortFields,
) {
  return z.strictObject({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().positive().max(100).default(5),
    sortBy: z.enum(sortableFields).optional(),
    sortDirection: z.enum(SORT_DIRECTIONS).default(SORT_DIRECTIONS[0]),
  });
}
