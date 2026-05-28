import { ValidationError } from '../../shared/errors/http-errors';
import { type PaginatedResponseDto, toPaginatedResponseDto } from '../../shared/pagination/pagination.types';
import { organizationRepository } from '../organizations/organization.repository';
import { userRepository } from '../users/user.repository';
import { orderRepository } from './order.repository';
import type {
  CreateOrderBodyDto,
  ListOrderQueryDto,
  OrderListItemResponseDto,
  OrderResponseDto,
} from './order.schemas';
import type { Order } from './order.types';

export const orderService = {
  async create(dto: CreateOrderBodyDto): Promise<OrderResponseDto> {
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
};

function toOrderListItemResponseDto(order: Order): OrderListItemResponseDto {
  return {
    id: order.id,
    organizationId: order.organizationId,
    userId: order.userId,
    totalAmount: order.totalAmount,
    orderDate: order.orderDate,
  };
}
