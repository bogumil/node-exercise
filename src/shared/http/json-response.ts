import type { ZodType } from 'zod';

export function jsonResponse(description: string, schema: ZodType) {
  return {
    description,
    content: {
      'application/json': {
        schema,
      },
    },
  };
}
