import { OrderModel, UserModel } from '../../infrastructure/database/models';
import type { PaginatedResult } from '../../shared/pagination/pagination.types';
import type { CreateUserBodyDto, ListUserQueryDto, UpdateUserBodyDto } from './user.schemas';
import type { User } from './user.types';

function toUser(model: UserModel): User {
  return {
    id: model.id,
    organizationId: model.organizationId,
    firstName: model.firstName,
    lastName: model.lastName,
    email: model.email ?? null,
    dateCreated: model.dateCreated.toISOString(),
  };
}

type UserUpdateAttributes = {
  organizationId?: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
};

export const userRepository = {
  async create(dto: CreateUserBodyDto): Promise<User> {
    const user = await UserModel.create(dto);
    return toUser(user);
  },

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    return user ? toUser(user) : null;
  },

  async deleteById(id: string): Promise<boolean> {
    const deletedCount = await UserModel.destroy({ where: { id }, individualHooks: true });

    return deletedCount > 0;
  },

  async updateById(id: string, dto: UpdateUserBodyDto): Promise<User | null> {
    const user = await UserModel.findByPk(id);

    if (!user) {
      return null;
    }

    await user.update(toUpdateAttributes(dto));

    return toUser(user);
  },

  async findMany(query: ListUserQueryDto): Promise<PaginatedResult<User>> {
    const offset = (query.page - 1) * query.pageSize;

    const result = await UserModel.findAndCountAll({
      limit: query.pageSize,
      offset,
      order:
        query.sortBy && query.sortDirection
          ? [[query.sortBy, query.sortDirection.toUpperCase()]]
          : [['lastName', 'ASC']], // TODO - move to default consts
    });

    return {
      items: result.rows.map(toUser),
      totalItems: result.count,
    };
  },

  async countDeleteBlockers(id: string): Promise<{ orders: number }> {
    const orders = await OrderModel.count({ where: { userId: id } });

    return { orders };
  },
};

function toUpdateAttributes(dto: UpdateUserBodyDto): UserUpdateAttributes {
  const update: UserUpdateAttributes = {};

  if (dto.organizationId !== undefined) {
    update.organizationId = dto.organizationId;
  }

  if (dto.firstName !== undefined) {
    update.firstName = dto.firstName;
  }

  if (dto.lastName !== undefined) {
    update.lastName = dto.lastName;
  }

  if (dto.email !== undefined) {
    update.email = dto.email;
  }

  return update;
}
