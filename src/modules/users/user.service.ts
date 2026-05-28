import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/http-errors';
import { type PaginatedResponseDto, toPaginatedResponseDto } from '../../shared/pagination/pagination.types';
import { organizationRepository } from '../organizations/organization.repository';
import { userRepository } from './user.repository';
import type { CreateUserBodyDto, ListUserQueryDto, UpdateUserBodyDto, UserResponseDto } from './user.schemas';
import type { User } from './user.types';

export const userService = {
  async create(dto: CreateUserBodyDto): Promise<UserResponseDto> {
    await validateOrganizationExists(dto.organizationId);
    const user = await userRepository.create(dto);

    return toUserResponseDto(user);
  },

  async findById(id: string): Promise<UserResponseDto> {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new NotFoundError();
    }

    return toUserResponseDto(user);
  },

  async list(query: ListUserQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    const result = await userRepository.findMany(query);

    return toPaginatedResponseDto(
      {
        items: result.items.map(toUserResponseDto),
        totalItems: result.totalItems,
      },
      query,
    );
  },

  async updateById(id: string, dto: UpdateUserBodyDto): Promise<UserResponseDto> {
    if (dto.organizationId !== undefined) {
      await validateOrganizationExists(dto.organizationId);
    }

    const user = await userRepository.updateById(id, dto);

    if (!user) {
      throw new NotFoundError();
    }

    return toUserResponseDto(user);
  },

  async deleteById(id: string): Promise<void> {
    const blockers = await userRepository.countDeleteBlockers(id);

    if (blockers.orders > 0) {
      throw new ConflictError('User cannot be deleted because they are still referenced by orders', {
        id: [
          `User has ${blockers.orders} order(s). Delete or reassign those orders before deleting the user.`,
        ],
      });
    }

    const deleted = await userRepository.deleteById(id);

    if (!deleted) {
      throw new NotFoundError();
    }
  },
};

function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    organizationId: user.organizationId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dateCreated: user.dateCreated,
  };
}

async function validateOrganizationExists(organizationId: string): Promise<void> {
  const organization = await organizationRepository.findById(organizationId);

  if (!organization) {
    throw new ValidationError({
      organizationId: ['Organization does not exist'],
    });
  }
}
