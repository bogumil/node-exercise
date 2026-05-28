import { z } from 'zod';
import { SORT_DIRECTIONS } from './pagination.types';

export function createPaginationQuerySchema<const TSortFields extends readonly [string, ...string[]]>(
  sortableFields: TSortFields,
) {
  return z.strictObject({
    page: z.coerce.number().int().positive().default(1).openapi({
      description: 'Page number to return.',
      example: 1,
    }),
    pageSize: z.coerce.number().positive().max(100).default(5).openapi({
      description: 'Maximum number of items to return on one page.',
      example: 5,
    }),
    sortBy: z.enum(sortableFields).optional().openapi({
      description: 'Field used to sort the result set.',
      example: sortableFields[0],
    }),
    sortDirection: z.enum(SORT_DIRECTIONS).default(SORT_DIRECTIONS[0]).openapi({
      description: 'Sort direction for the selected sort field.',
      example: 'asc',
    }),
  });
}

export function createPaginationResponseSchema<T extends z.ZodType>(name: string, itemSchema: T) {
  return z
    .strictObject({
      data: z.array(itemSchema),
      meta: z.strictObject({
        currentPage: z.number().int(),
        itemsOnPage: z.number().int(),
        pageSize: z.number().int(),
        totalItems: z.number().int(),
        totalPages: z.number().int(),
        hasNextPage: z.boolean(),
        hasPreviousPage: z.boolean(),
      }),
    })
    .openapi(name);
}
