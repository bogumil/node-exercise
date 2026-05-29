import {
  invalidateOrders,
  invalidateOrganizations,
  invalidateUsers,
} from '../../shared/cache/cache.invalidation';
import { cacheKeys } from '../../shared/cache/cache.keys';
import { getOrSet } from '../../shared/cache/cache.service';
import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/http-errors';
import { type PaginatedResponseDto, toPaginatedResponseDto } from '../../shared/pagination/pagination.types';
import { organizationRepository } from './organization.repository';
import type {
  CreateOrganizationBodyDto,
  ListOrganizationQueryDto,
  OrganizationResponseDto,
  UpdateOrganizationBodyDto,
} from './organization.schemas';
import type { Organization } from './organization.types';

export const organizationService = {
  async create(dto: CreateOrganizationBodyDto): Promise<OrganizationResponseDto> {
    validateDateFounded(dto.dateFounded);

    const organization = await organizationRepository.create(dto);

    invalidateOrganizations();

    return toOrganizationResponseDto(organization);
  },

  async findById(id: string): Promise<OrganizationResponseDto> {
    return getOrSet(cacheKeys.organizations.detail(id), async () => {
      const organization = await organizationRepository.findById(id);

      if (!organization) {
        throw new NotFoundError();
      }

      return toOrganizationResponseDto(organization);
    });
  },

  async list(query: ListOrganizationQueryDto): Promise<PaginatedResponseDto<OrganizationResponseDto>> {
    return getOrSet(cacheKeys.organizations.list(JSON.stringify(query)), async () => {
      const result = await organizationRepository.findMany(query);

      return toPaginatedResponseDto(
        {
          items: result.items.map(toOrganizationResponseDto),
          totalItems: result.totalItems,
        },
        query,
      );
    });
  },

  async updateById(id: string, dto: UpdateOrganizationBodyDto): Promise<OrganizationResponseDto> {
    validateDateFounded(dto.dateFounded);

    const organization = await organizationRepository.updateById(id, dto);

    if (!organization) {
      throw new NotFoundError();
    }

    invalidateOrganizations();
    invalidateUsers();
    invalidateOrders();

    return toOrganizationResponseDto(organization);
  },

  async deleteById(id: string): Promise<void> {
    const blockers = await organizationRepository.countDeleteBlockers(id);

    if (blockers.users > 0 || blockers.orders > 0) {
      throw new ConflictError(
        'Organization cannot be deleted because it is still referenced by other records',
        {
          id: [
            `Organization has ${blockers.users} user(s) and ${blockers.orders} order(s). Delete or reassign them before deleting the organization.`,
          ],
        },
      );
    }

    const deleted = await organizationRepository.deleteById(id);

    if (!deleted) {
      throw new NotFoundError();
    }

    invalidateOrganizations();
    invalidateUsers();
    invalidateOrders();
  },
};

function validateDateFounded(dateFounded: string | undefined | null) {
  if (dateFounded !== undefined && dateFounded !== null && new Date(dateFounded).getTime() > Date.now()) {
    throw new ValidationError({
      dateFounded: ['Date founded has to be before the current timestamp'],
    });
  }
}

function toOrganizationResponseDto(organization: Organization): OrganizationResponseDto {
  return {
    id: organization.id,
    name: organization.name,
    industry: organization.industry,
    dateFounded: organization.dateFounded,
  };
}
