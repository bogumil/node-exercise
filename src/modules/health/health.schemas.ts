import { z } from 'zod';

export const healthResponseSchema = z
  .strictObject({
    status: z.enum(['OK']),
    environment: z.string(),
  })
  .openapi('HealthResponse');

export const readinessResponseSchema = z
  .strictObject({
    status: z.enum(['OK', 'ERROR']),
    environment: z.string(),
    checks: z.strictObject({
      database: z.strictObject({
        status: z.enum(['OK', 'ERROR']),
      }),
      cache: z.strictObject({
        status: z.enum(['OK', 'ERROR']),
      }),
    }),
  })
  .openapi('ReadinessResponse');
