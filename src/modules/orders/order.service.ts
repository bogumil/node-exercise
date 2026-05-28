import { ValidationError } from '../../shared/errors/http-errors';
import { organizationRepository } from '../organizations/organization.repository';
import { userRepository } from '../users/user.repository';
import { orderRepository } from './order.repository';
import type { CreateOrderBodyDto, OrderResponseDto } from './order.schemas';

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
};
