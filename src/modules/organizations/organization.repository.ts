import { OrganizationModel } from '../../infrastructure/database/models';
import type { PaginatedResult } from '../../shared/pagination/pagination.types';
import type {
  CreateOrganizationBodyDto,
  ListOrganizationQueryDto,
  UpdateOrganizationBodyDto,
} from './organization.schemas';
import type { Organization } from './organization.types';

function toOrganization(model: OrganizationModel): Organization {
  return {
    id: model.id,
    name: model.name,
    industry: model.industry,
    dateFounded: model.dateFounded,
  };
}

type OrganizationUpdateAttributes = {
  name?: string;
  industry?: string | null;
  dateFounded?: string | null;
};

export const organizationRepository = {
  async create(dto: CreateOrganizationBodyDto): Promise<Organization> {
    const organization = await OrganizationModel.create(dto);
    return toOrganization(organization);
  },

  async findById(id: string): Promise<Organization | null> {
    const organization = await OrganizationModel.findByPk(id);
    return organization ? toOrganization(organization) : null;
  },

  async deleteById(id: string): Promise<boolean> {
    const deletedCount = await OrganizationModel.destroy({ where: { id }, individualHooks: true });

    return deletedCount > 0;
  },

  async updateById(id: string, dto: UpdateOrganizationBodyDto): Promise<Organization | null> {
    const organization = await OrganizationModel.findByPk(id);

    if (!organization) {
      return null;
    }

    await organization.update(toUpdateAttributes(dto));

    return toOrganization(organization);
  },

  async findMany(query: ListOrganizationQueryDto): Promise<PaginatedResult<Organization>> {
    const offset = (query.page - 1) * query.pageSize;

    const result = await OrganizationModel.findAndCountAll({
      limit: query.pageSize,
      offset,
      order:
        query.sortBy && query.sortDirection
          ? [[query.sortBy, query.sortDirection.toUpperCase()]]
          : [['name', 'ASC']], // TODO - move to default consts
    });

    return {
      items: result.rows.map(toOrganization),
      totalItems: result.count,
    };
  },
};

function toUpdateAttributes(dto: UpdateOrganizationBodyDto): OrganizationUpdateAttributes {
  const update: OrganizationUpdateAttributes = {};

  if (dto.name !== undefined) {
    update.name = dto.name;
  }

  if (dto.industry !== undefined) {
    update.industry = dto.industry;
  }

  if (dto.dateFounded !== undefined) {
    update.dateFounded = dto.dateFounded;
  }

  return update;
}
