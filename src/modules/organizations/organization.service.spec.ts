import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NotFoundError, ValidationError } from '../../shared/errors/http-errors';
import { organizationRepository } from './organization.repository';
import { organizationService } from './organization.service';

jest.mock('./organization.repository', () => ({
  organizationRepository: {
    create: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    countDeleteBlockers: jest.fn(),
  },
}));

const repo = jest.mocked(organizationRepository);

describe('organizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-05-28T00:00:00Z'));
    repo.countDeleteBlockers.mockResolvedValue({ users: 0, orders: 0 });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('rejects future dateFounded', async () => {
    await expect(
      organizationService.create({ name: 'Future Org', dateFounded: '2026-05-29' }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(repo.create).not.toHaveBeenCalled();
  });

  it('throws NotFoundError when organization does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(organizationService.findById('missing-id')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('deletes organization when it exists', async () => {
    repo.deleteById.mockResolvedValue(true);

    await expect(organizationService.deleteById('organization-id')).resolves.toBeUndefined();

    expect(repo.deleteById).toHaveBeenCalledWith('organization-id');
  });

  it('throws NotFoundError when deleting missing organization', async () => {
    repo.deleteById.mockResolvedValue(false);

    await expect(organizationService.deleteById('missing-id')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('updates organization with provided fields only', async () => {
    repo.updateById.mockResolvedValue({
      id: 'organization-id',
      name: 'Updated Org',
      industry: 'Logistics',
      dateFounded: null,
    });

    await expect(organizationService.updateById('organization-id', { name: 'Updated Org' })).resolves.toEqual(
      {
        id: 'organization-id',
        name: 'Updated Org',
        industry: 'Logistics',
        dateFounded: null,
      },
    );

    expect(repo.updateById).toHaveBeenCalledWith('organization-id', {
      name: 'Updated Org',
    });
  });

  it('allows clearing nullable fields', async () => {
    repo.updateById.mockResolvedValue({
      id: 'organization-id',
      name: 'Org',
      industry: null,
      dateFounded: null,
    });

    await expect(
      organizationService.updateById('organization-id', {
        industry: null,
        dateFounded: null,
      }),
    ).resolves.toEqual({
      id: 'organization-id',
      name: 'Org',
      industry: null,
      dateFounded: null,
    });

    expect(repo.updateById).toHaveBeenCalledWith('organization-id', {
      industry: null,
      dateFounded: null,
    });
  });

  it('throws NotFoundError when updating missing organization', async () => {
    repo.updateById.mockResolvedValue(null);

    await expect(
      organizationService.updateById('missing-id', { name: 'Missing Org' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('rejects future dateFounded when updating', async () => {
    await expect(
      organizationService.updateById('organization-id', {
        dateFounded: '2026-05-29',
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(repo.updateById).not.toHaveBeenCalled();
  });
});
