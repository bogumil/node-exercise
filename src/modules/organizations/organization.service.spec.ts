import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NotFoundError, ValidationError } from '../../shared/errors/http-errors';
import { organizationRepository } from './organization.repository';
import { organizationService } from './organization.service';

jest.mock('./organization.repository', () => ({
  organizationRepository: {
    create: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    deleteById: jest.fn(),
  },
}));

const repo = jest.mocked(organizationRepository);

describe('organizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-05-28T00:00:00Z'));
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
});
