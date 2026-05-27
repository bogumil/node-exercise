import { OrganizationModel } from '../../infrastructure/database/models';
import type { CreateOrganizationBodyDto } from './organization.schemas';
import type { Organization } from './organization.types';

function toOrganization(model: OrganizationModel): Organization {
  return {
    id: model.id,
    name: model.name,
    industry: model.industry,
    dateFounded: model.dateFounded,
  };
}

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
    const deletedCount = await OrganizationModel.destroy({ where: { id } });

    return deletedCount > 0;
  },
};
