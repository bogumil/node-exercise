import { z } from 'zod';
import {
  createPaginationQuerySchema,
  createPaginationResponseSchema,
} from '../../shared/pagination/pagination.schema';

const emailSchema = z.preprocess((value) => (typeof value === 'string' ? value.trim() : value), z.email());

export const createUserBodySchema = z
  .strictObject({
    organizationId: z.uuidv4('Invalid organization id'),
    firstName: z
      .string()
      .trim()
      .min(1, 'First name must contain at least 1 character')
      .max(100, `First name must contain at most 100 characters`),
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name must contain at least 1 character')
      .max(100, `Last name must contain at most 100 characters`),
    email: emailSchema.optional(),
  })
  .openapi('CreateUserRequest');
export type CreateUserBodyDto = z.infer<typeof createUserBodySchema>;

export const userResponseSchema = z
  .strictObject({
    id: z.uuidv4(),
    organizationId: z.uuidv4(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().nullable(),
    dateCreated: z.iso.datetime(),
  })
  .openapi('UserResponse');
export type UserResponseDto = z.infer<typeof userResponseSchema>;

export const userSortFields = ['firstName', 'lastName', 'email', 'dateCreated'] as const;
export const listUserQuerySchema = createPaginationQuerySchema(userSortFields);
export type ListUserQueryDto = z.infer<typeof listUserQuerySchema>;

export const paginatedUserResponseSchema = createPaginationResponseSchema(
  'PaginatedUserResponse',
  userResponseSchema,
);

export const updateUserBodySchema = z
  .strictObject({
    organizationId: z.uuidv4('Invalid organization id').optional(),
    firstName: z
      .string()
      .trim()
      .min(1, 'First name must contain at least 1 character')
      .max(100, 'First name must contain at most 100 characters')
      .optional(),
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name must contain at least 1 character')
      .max(100, 'Last name must contain at most 100 characters')
      .optional(),
    email: emailSchema.nullable().optional(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field has to be provided',
  })
  .openapi('UpdateUserRequest');

export type UpdateUserBodyDto = z.infer<typeof updateUserBodySchema>;
