import { invalidateOrders } from '../../shared/cache/cache.invalidation';
import { cacheKeys } from '../../shared/cache/cache.keys';
import { getOrSet } from '../../shared/cache/cache.service';
import { NotFoundError, ValidationError } from '../../shared/errors/http-errors';
import { type PaginatedResponseDto, toPaginatedResponseDto } from '../../shared/pagination/pagination.types';
import { organizationRepository } from '../organizations/organization.repository';
import { userRepository } from '../users/user.repository';
import { orderRepository } from './order.repository';
import type {
  CreateOrderBodyDto,
  ListOrderQueryDto,
  OrderListItemResponseDto,
  OrderResponseDto,
  UpdateOrderBodyDto,
} from './order.schemas';
import type { Order, OrderWithRelations } from './order.types';

export const orderService = {
  async create(dto: CreateOrderBodyDto): Promise<OrderResponseDto> {
    validateOrderDate(dto.orderDate);
    validateCreateTotalAmount(dto.totalAmount);

    const [organization, user] = await Promise.all([
      organizationRepository.findById(dto.organizationId),
      userRepository.findById(dto.userId),
    ]);

    if (!organization) {
      throw new ValidationError({ organizationId: ['Organization does not exist'] });
    }

    if (!user) {
      throw new ValidationError({ userId: ['User does not exist'] });
    }

    if (user.organizationId !== dto.organizationId) {
      throw new ValidationError({
        userId: ['User does not belong to the selected organization'],
      });
    }

    const result = await orderRepository.create(dto);

    invalidateOrders();

    return toOrderResponseDto(result);
  },

  async list(query: ListOrderQueryDto): Promise<PaginatedResponseDto<OrderListItemResponseDto>> {
    return getOrSet(cacheKeys.orders.list(JSON.stringify(query)), async () => {
      const result = await orderRepository.findMany(query);

      return toPaginatedResponseDto(
        {
          items: result.items.map(toOrderListItemResponseDto),
          totalItems: result.totalItems,
        },
        query,
      );
    });
  },

  async findById(id: string): Promise<OrderResponseDto> {
    return getOrSet(cacheKeys.orders.detail(id), async () => {
      const order = await orderRepository.findById(id);

      if (!order) {
        throw new NotFoundError();
      }

      return toOrderResponseDto(order);
    });
  },

  async updateById(id: string, dto: UpdateOrderBodyDto): Promise<OrderResponseDto> {
    validateOrderDate(dto.orderDate);
    validateCreateTotalAmount(dto.totalAmount);

    const existingOrder = await orderRepository.findById(id);

    if (!existingOrder) {
      throw new NotFoundError();
    }

    const organizationId = dto.organizationId ?? existingOrder.organizationId;
    const userId = dto.userId ?? existingOrder.userId;

    const [organization, user] = await Promise.all([
      organizationRepository.findById(organizationId),
      userRepository.findById(userId),
    ]);

    if (!organization) {
      throw new ValidationError({ organizationId: ['Organization does not exist'] });
    }

    if (!user) {
      throw new ValidationError({ userId: ['User does not exist'] });
    }

    if (user.organizationId !== organizationId) {
      throw new ValidationError({
        userId: ['User does not belong to the selected organization'],
      });
    }

    const updatedOrder = await orderRepository.updateById(id, dto);

    if (!updatedOrder) {
      throw new NotFoundError();
    }

    invalidateOrders();

    return toOrderResponseDto(updatedOrder);
  },

  async deleteById(id: string): Promise<void> {
    const deleted = await orderRepository.deleteById(id);

    if (!deleted) {
      throw new NotFoundError();
    }

    invalidateOrders();
  },
};

function validateOrderDate(orderDate: string | undefined) {
  if (orderDate !== undefined && new Date(orderDate).getTime() > Date.now()) {
    throw new ValidationError({
      orderDate: ['Order date cannot be later than the current timestamp'],
    });
  }
}

function validateCreateTotalAmount(totalAmount: number | undefined) {
  if (totalAmount !== undefined && totalAmount <= 0) {
    throw new ValidationError({
      totalAmount: ['Total amount has to be greater than 0'],
    });
  }
}

function toOrderListItemResponseDto(order: Order): OrderListItemResponseDto {
  return {
    id: order.id,
    organizationId: order.organizationId,
    userId: order.userId,
    totalAmount: order.totalAmount,
    orderDate: order.orderDate,
  };
}

export function toOrderResponseDto(order: OrderWithRelations): OrderResponseDto {
  return {
    id: order.id,
    organizationId: order.organizationId,
    userId: order.userId,
    totalAmount: order.totalAmount,
    orderDate: order.orderDate,
    user: order.user,
    organization: order.organization,
  };
}
