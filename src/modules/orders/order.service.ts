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
import type { Order } from './order.types';

export const orderService = {
  async create(dto: CreateOrderBodyDto): Promise<OrderResponseDto> {
    validateOrderDate(dto.orderDate);

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

    return orderRepository.create(dto);
  },

  async list(query: ListOrderQueryDto): Promise<PaginatedResponseDto<OrderListItemResponseDto>> {
    const result = await orderRepository.findMany(query);

    return toPaginatedResponseDto(
      {
        items: result.items.map(toOrderListItemResponseDto),
        totalItems: result.totalItems,
      },
      query,
    );
  },

  async findById(id: string): Promise<OrderResponseDto> {
    const order = await orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError();
    }

    return order;
  },

  async updateById(id: string, dto: UpdateOrderBodyDto): Promise<OrderResponseDto> {
    validateOrderDate(dto.orderDate);

    const existingOrder = await orderRepository.findById(id);

    if (!existingOrder) {
      throw new NotFoundError();
    }

    const organizationId = dto.organizationId ?? existingOrder.organization.id;
    const userId = dto.userId ?? existingOrder.user.id;

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

    return updatedOrder;
  },

  async deleteById(id: string): Promise<void> {
    const deleted = await orderRepository.deleteById(id);

    if (!deleted) {
      throw new NotFoundError();
    }
  },
};

function validateOrderDate(orderDate: string | undefined) {
  if (orderDate !== undefined && new Date(orderDate).getTime() > Date.now()) {
    throw new ValidationError({
      orderDate: ['Order date cannot be later than the current timestamp'],
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
