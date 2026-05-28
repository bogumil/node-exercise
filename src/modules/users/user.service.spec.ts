import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NotFoundError, ValidationError } from '../../shared/errors/http-errors';
import { organizationRepository } from '../organizations/organization.repository';
import { userRepository } from './user.repository';
import { userService } from './user.service';

jest.mock('../organizations/organization.repository', () => ({
  organizationRepository: {
    findById: jest.fn(),
  },
}));

jest.mock('./user.repository', () => ({
  userRepository: {
    create: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    countDeleteBlockers: jest.fn(),
  },
}));

const userRepo = jest.mocked(userRepository);
const organizationRepo = jest.mocked(organizationRepository);

const organizationId = '8b7f7f10-4f9f-4b4e-b5f7-1f8c2a19b111';
const userId = '1df8e30b-4a1c-4b65-8f7a-809d8f6a8b31';

const user = {
  id: userId,
  organizationId,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  dateCreated: '2026-05-28T10:00:00.000Z',
};

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    userRepo.countDeleteBlockers.mockResolvedValue({ orders: 0 });
    organizationRepo.findById.mockResolvedValue({
      id: organizationId,
      name: 'Acme',
      industry: 'Logistics',
      dateFounded: null,
    });
  });

  it('creates user when organization exists', async () => {
    userRepo.create.mockResolvedValue(user);

    await expect(
      userService.create({
        organizationId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      }),
    ).resolves.toEqual(user);

    expect(organizationRepo.findById).toHaveBeenCalledWith(organizationId);
    expect(userRepo.create).toHaveBeenCalledWith({
      organizationId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    });
  });

  it('rejects creating user for missing organization', async () => {
    organizationRepo.findById.mockResolvedValue(null);

    await expect(
      userService.create({
        organizationId,
        firstName: 'John',
        lastName: 'Doe',
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(userRepo.create).not.toHaveBeenCalled();
  });

  it('returns user by id', async () => {
    userRepo.findById.mockResolvedValue(user);

    await expect(userService.findById(userId)).resolves.toEqual(user);

    expect(userRepo.findById).toHaveBeenCalledWith(userId);
  });

  it('throws NotFoundError when user does not exist', async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(userService.findById(userId)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('lists users as paginated response', async () => {
    userRepo.findMany.mockResolvedValue({
      items: [user],
      totalItems: 1,
    });

    await expect(
      userService.list({
        page: 1,
        pageSize: 5,
        sortBy: 'lastName',
        sortDirection: 'asc',
      }),
    ).resolves.toEqual({
      data: [user],
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

  it('updates user with provided fields', async () => {
    const updatedUser = {
      ...user,
      firstName: 'Jane',
      email: null,
    };

    userRepo.updateById.mockResolvedValue(updatedUser);

    await expect(
      userService.updateById(userId, {
        firstName: 'Jane',
        email: null,
      }),
    ).resolves.toEqual(updatedUser);

    expect(organizationRepo.findById).not.toHaveBeenCalled();
    expect(userRepo.updateById).toHaveBeenCalledWith(userId, {
      firstName: 'Jane',
      email: null,
    });
  });

  it('validates organization when updating organizationId', async () => {
    userRepo.updateById.mockResolvedValue(user);

    await expect(
      userService.updateById(userId, {
        organizationId,
      }),
    ).resolves.toEqual(user);

    expect(organizationRepo.findById).toHaveBeenCalledWith(organizationId);
  });

  it('rejects updating user to missing organization', async () => {
    organizationRepo.findById.mockResolvedValue(null);

    await expect(
      userService.updateById(userId, {
        organizationId,
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(userRepo.updateById).not.toHaveBeenCalled();
  });

  it('throws NotFoundError when updating missing user', async () => {
    userRepo.updateById.mockResolvedValue(null);

    await expect(
      userService.updateById(userId, {
        firstName: 'Jane',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('deletes user when it exists', async () => {
    userRepo.deleteById.mockResolvedValue(true);

    await expect(userService.deleteById(userId)).resolves.toBeUndefined();

    expect(userRepo.deleteById).toHaveBeenCalledWith(userId);
  });

  it('throws NotFoundError when deleting missing user', async () => {
    userRepo.deleteById.mockResolvedValue(false);

    await expect(userService.deleteById(userId)).rejects.toBeInstanceOf(NotFoundError);
  });
});
