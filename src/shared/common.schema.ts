import { z } from 'zod';

export const uuidIdParamsSchema = z.strictObject({
  id: z.uuidv4('Invalid id'),
});

export type UuidIdParamsSchema = z.infer<typeof uuidIdParamsSchema>;
