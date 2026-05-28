import { z } from 'zod';

export const uuidIdParamsSchema = z.strictObject({
  id: z.uuidv4('Invalid id').openapi({
    example: '8b7f7f10-4f9f-4b4e-b5f7-1f8c2a19b111',
    description: 'Resource id',
  }),
});

export type UuidIdParamsSchema = z.infer<typeof uuidIdParamsSchema>;
