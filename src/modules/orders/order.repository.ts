import { OrderModel, OrganizationModel, UserModel } from '../../infrastructure/database/models';
import type { PaginatedResult } from '../../shared/pagination/pagination.types';
import type { CreateOrderBodyDto, ListOrderQueryDto, UpdateOrderBodyDto } from './order.schemas';
import type { Order, OrderWithRelations } from './order.types';

function toOrder(model: OrderModel): Order {
  return {
    id: model.id,
    organizationId: model.organizationId,
    userId: model.userId,
    totalAmount: Number(model.totalAmount),
    orderDate: model.orderDate.toISOString(),
  };
}

function toOrderWithRelations(model: OrderModel): OrderWithRelations {
  if (!model.user || !model.organization) {
    throw new Error('Order relations were not loaded');
  }

  return {
    ...toOrder(model),
    user: {
      id: model.user.id,
      organizationId: model.user.organizationId,
      firstName: model.user.firstName,
      lastName: model.user.lastName,
      email: model.user.email ?? null,
      dateCreated: model.user.dateCreated.toISOString(),
    },
    organization: {
      id: model.organization.id,
      name: model.organization.name,
      industry: model.organization.industry,
      dateFounded: model.organization.dateFounded,
    },
  };
}

type OrderUpdateAttributes = {
  organizationId?: string;
  userId?: string;
  totalAmount?: number;
  orderDate?: Date;
};

const orderDetailsInclude = [
  { model: UserModel, as: 'user', required: true },
  { model: OrganizationModel, as: 'organization', required: true },
];

export const orderRepository = {
  async create(dto: CreateOrderBodyDto): Promise<OrderWithRelations> {
    const order = await OrderModel.create({
      organizationId: dto.organizationId,
      userId: dto.userId,
      totalAmount: dto.totalAmount,
      orderDate: new Date(dto.orderDate),
    });

    await order.reload({ include: orderDetailsInclude });

    return toOrderWithRelations(order);
  },

  async findMany(query: ListOrderQueryDto): Promise<PaginatedResult<Order>> {
    const result = await OrderModel.findAndCountAll({
      limit: query.pageSize,
      offset: (query.page - 1) * query.pageSize,
      order: query.sortBy ? [[query.sortBy, query.sortDirection.toUpperCase()]] : [['orderDate', 'DESC']],
    });

    return {
      items: result.rows.map(toOrder),
      totalItems: result.count,
    };
  },

  async findById(id: string): Promise<OrderWithRelations | null> {
    const order = await OrderModel.findByPk(id, {
      include: orderDetailsInclude,
    });

    return order ? toOrderWithRelations(order) : null;
  },

  async updateById(id: string, dto: UpdateOrderBodyDto): Promise<OrderWithRelations | null> {
    const order = await OrderModel.findByPk(id);

    if (!order) {
      return null;
    }

    await order.update(toUpdateAttributes(dto));
    await order.reload({ include: orderDetailsInclude });

    return toOrderWithRelations(order);
  },

  async deleteById(id: string): Promise<boolean> {
    const deletedCount = await OrderModel.destroy({
      where: { id },
      individualHooks: true,
    });

    return deletedCount > 0;
  },
};

function toUpdateAttributes(dto: UpdateOrderBodyDto): OrderUpdateAttributes {
  const update: OrderUpdateAttributes = {};

  if (dto.organizationId !== undefined) {
    update.organizationId = dto.organizationId;
  }

  if (dto.userId !== undefined) {
    update.userId = dto.userId;
  }

  if (dto.totalAmount !== undefined) {
    update.totalAmount = dto.totalAmount;
  }

  if (dto.orderDate !== undefined) {
    update.orderDate = new Date(dto.orderDate);
  }

  return update;
}
