import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NotFoundError, ValidationError } from '../../shared/errors/http-errors';
import { organizationRepository } from '../organizations/organization.repository';
import { userRepository } from '../users/user.repository';
import { orderRepository } from './order.repository';
import { orderService } from './order.service';

jest.mock('../organizations/organization.repository', () => ({
  organizationRepository: {
    findById: jest.fn(),
  },
}));

jest.mock('../users/user.repository', () => ({
  userRepository: {
    findById: jest.fn(),
  },
}));

jest.mock('./order.repository', () => ({
  orderRepository: {
    create: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  },
}));

const organizationRepo = jest.mocked(organizationRepository);
const userRepo = jest.mocked(userRepository);
const orderRepo = jest.mocked(orderRepository);

const organizationId = '8b7f7f10-4f9f-4b4e-b5f7-1f8c2a19b111';
const otherOrganizationId = '5773f604-ece7-4551-ae3d-8f60263139d3';
const userId = '1df8e30b-4a1c-4b65-8f7a-809d8f6a8b31';
const orderId = '9b55f460-2e23-4fd0-b77a-57ed72dc5d1c';

const organization = {
  id: organizationId,
  name: 'Acme',
  industry: 'Logistics',
  dateFounded: null,
};

const user = {
  id: userId,
  organizationId,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  dateCreated: '2026-05-28T10:00:00.000Z',
};

const order = {
  id: orderId,
  totalAmount: 123.45,
  orderDate: '2026-05-27T10:00:00.000Z',
  user,
  organization,
};

describe('orderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-05-28T00:00:00Z'));

    organizationRepo.findById.mockResolvedValue(organization);
    userRepo.findById.mockResolvedValue(user);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('creates order when organization and user are valid', async () => {
    orderRepo.create.mockResolvedValue(order);

    await expect(
      orderService.create({
        organizationId,
        userId,
        totalAmount: 123.45,
        orderDate: '2026-05-27T10:00:00.000Z',
      }),
    ).resolves.toEqual(order);

    expect(organizationRepo.findById).toHaveBeenCalledWith(organizationId);
    expect(userRepo.findById).toHaveBeenCalledWith(userId);
    expect(orderRepo.create).toHaveBeenCalledWith({
      organizationId,
      userId,
      totalAmount: 123.45,
      orderDate: '2026-05-27T10:00:00.000Z',
    });
  });

  it('rejects creating order with future orderDate', async () => {
    await expect(
      orderService.create({
        organizationId,
        userId,
        totalAmount: 123.45,
        orderDate: '2026-05-29T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(orderRepo.create).not.toHaveBeenCalled();
  });

  it('rejects creating order for missing organization', async () => {
    organizationRepo.findById.mockResolvedValue(null);

    await expect(
      orderService.create({
        organizationId,
        userId,
        totalAmount: 123.45,
        orderDate: '2026-05-27T10:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(orderRepo.create).not.toHaveBeenCalled();
  });

  it('rejects creating order for missing user', async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(
      orderService.create({
        organizationId,
        userId,
        totalAmount: 123.45,
        orderDate: '2026-05-27T10:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(orderRepo.create).not.toHaveBeenCalled();
  });

  it('rejects creating order when user belongs to another organization', async () => {
    userRepo.findById.mockResolvedValue({
      ...user,
      organizationId: otherOrganizationId,
    });

    await expect(
      orderService.create({
        organizationId,
        userId,
        totalAmount: 123.45,
        orderDate: '2026-05-27T10:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(orderRepo.create).not.toHaveBeenCalled();
  });

  it('lists orders as paginated response', async () => {
    orderRepo.findMany.mockResolvedValue({
      items: [
        {
          id: orderId,
          organizationId,
          userId,
          totalAmount: 123.45,
          orderDate: '2026-05-27T10:00:00.000Z',
        },
      ],
      totalItems: 1,
    });

    await expect(
      orderService.list({
        page: 1,
        pageSize: 5,
        sortBy: 'orderDate',
        sortDirection: 'desc',
      }),
    ).resolves.toEqual({
      data: [
        {
          id: orderId,
          organizationId,
          userId,
          totalAmount: 123.45,
          orderDate: '2026-05-27T10:00:00.000Z',
        },
      ],
      meta: {
        currentPage: 1,
        itemsOnPage: 1,
        pageSize: 5,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it('returns order by id', async () => {
    orderRepo.findById.mockResolvedValue(order);

    await expect(orderService.findById(orderId)).resolves.toEqual(order);

    expect(orderRepo.findById).toHaveBeenCalledWith(orderId);
  });

  it('throws NotFoundError when order does not exist', async () => {
    orderRepo.findById.mockResolvedValue(null);

    await expect(orderService.findById(orderId)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('updates order with provided fields', async () => {
    const updatedOrder = {
      ...order,
      totalAmount: 200,
    };

    orderRepo.findById.mockResolvedValue(order);
    orderRepo.updateById.mockResolvedValue(updatedOrder);

    await expect(orderService.updateById(orderId, { totalAmount: 200 })).resolves.toEqual(updatedOrder);

    expect(organizationRepo.findById).toHaveBeenCalledWith(organizationId);
    expect(userRepo.findById).toHaveBeenCalledWith(userId);
    expect(orderRepo.updateById).toHaveBeenCalledWith(orderId, { totalAmount: 200 });
  });

  it('throws NotFoundError when updating missing order', async () => {
    orderRepo.findById.mockResolvedValue(null);

    await expect(orderService.updateById(orderId, { totalAmount: 200 })).rejects.toBeInstanceOf(
      NotFoundError,
    );

    expect(orderRepo.updateById).not.toHaveBeenCalled();
  });

  it('rejects updating order to future orderDate', async () => {
    await expect(
      orderService.updateById(orderId, {
        orderDate: '2026-05-29T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(orderRepo.findById).not.toHaveBeenCalled();
    expect(orderRepo.updateById).not.toHaveBeenCalled();
  });

  it('rejects updating order when resolved user does not belong to resolved organization', async () => {
    orderRepo.findById.mockResolvedValue(order);
    userRepo.findById.mockResolvedValue({
      ...user,
      organizationId: otherOrganizationId,
    });

    await expect(orderService.updateById(orderId, { userId })).rejects.toBeInstanceOf(ValidationError);

    expect(orderRepo.updateById).not.toHaveBeenCalled();
  });

  it('deletes order when it exists', async () => {
    orderRepo.deleteById.mockResolvedValue(true);

    await expect(orderService.deleteById(orderId)).resolves.toBeUndefined();

    expect(orderRepo.deleteById).toHaveBeenCalledWith(orderId);
  });

  it('throws NotFoundError when deleting missing order', async () => {
    orderRepo.deleteById.mockResolvedValue(false);

    await expect(orderService.deleteById(orderId)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('rejects creating order with totalAmount equal to 0', async () => {
    await expect(
      orderService.create({
        organizationId,
        userId,
        totalAmount: 0,
        orderDate: '2026-05-27T10:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(orderRepo.create).not.toHaveBeenCalled();
  });
});
