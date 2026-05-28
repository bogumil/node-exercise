import { z } from 'zod';
import {
  createPaginationQuerySchema,
  createPaginationResponseSchema,
} from '../../shared/pagination/pagination.schema';
import { organizationResponseSchema } from '../organizations/organization.schemas';
import { userResponseSchema } from '../users/user.schemas';

const moneyAmountSchema = z
  .number()
  .nonnegative('Total amount cannot be negative')
  .max(9999999999.99, 'Total amount is too large')
  .refine((value) => Number.isInteger(value * 100), {
    message: 'Total amount can have at most 2 decimal places',
  });

export const createOrderBodySchema = z
  .strictObject({
    organizationId: z.uuidv4('Invalid organization id'),
    userId: z.uuidv4('Invalid user id'),
    totalAmount: moneyAmountSchema.gt(0),
    orderDate: z.iso.datetime('Order date must be a valid ISO datetime'),
  })
  .openapi('CreateOrderRequest');
export type CreateOrderBodyDto = z.infer<typeof createOrderBodySchema>;

export const orderListItemResponseSchema = z
  .strictObject({
    id: z.uuidv4(),
    organizationId: z.uuidv4(),
    userId: z.uuidv4(),
    totalAmount: moneyAmountSchema,
    orderDate: z.iso.datetime(),
  })
  .openapi('OrderListItemResponse');
export type OrderListItemResponseDto = z.infer<typeof orderListItemResponseSchema>;

export const orderResponseSchema = z
  .strictObject({
    id: z.uuidv4(),
    totalAmount: moneyAmountSchema,
    orderDate: z.iso.datetime(),
    user: userResponseSchema,
    organization: organizationResponseSchema,
  })
  .openapi('OrderResponse');
export type OrderResponseDto = z.infer<typeof orderResponseSchema>;

export const orderSortFields = ['orderDate', 'totalAmount'] as const;
export const listOrderQuerySchema = createPaginationQuerySchema(orderSortFields);
export type ListOrderQueryDto = z.infer<typeof listOrderQuerySchema>;

export const paginatedOrderResponseSchema = createPaginationResponseSchema(
  'PaginatedOrderResponse',
  orderListItemResponseSchema,
);

export const updateOrderBodySchema = z
  .strictObject({
    organizationId: z.uuidv4('Invalid organization id').optional(),
    userId: z.uuidv4('Invalid user id').optional(),
    totalAmount: moneyAmountSchema.gt(0).optional(),
    orderDate: z.iso.datetime('Order date must be a valid ISO datetime').optional(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field has to be provided',
  })
  .openapi('UpdateOrderRequest');
export type UpdateOrderBodyDto = z.infer<typeof updateOrderBodySchema>;
