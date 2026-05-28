import { z } from 'zod';

export const errorResponseSchema = z
  .strictObject({
    status: z.number(),
    message: z.string(),
    errors: z.record(z.string(), z.array(z.string())).optional(),
  })
  .openapi('ErrorResponse', {
    example: {
      status: 400,
      message: 'Validation error',
      errors: {
        id: ['Invalid id'],
        name: ['Invalid name'],
      },
    },
  });
export type ErrorResponseDto = z.infer<typeof errorResponseSchema>;
