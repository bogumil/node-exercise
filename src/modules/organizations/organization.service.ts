import { OrganizationModel } from '../../infrastructure/database/models';
import type { OrganizationResponseDto } from './organization.dto';
import type { CreateOrganizationBodyDto } from './organization.schemas';

export const organizationService = {
  async create(dto: CreateOrganizationBodyDto): Promise<OrganizationResponseDto> {
    const organization = await OrganizationModel.create(dto);

    return toOrganizationResponseDto(organization);
  },
};

function toOrganizationResponseDto(organization: OrganizationModel): OrganizationResponseDto {
  return {
    id: organization.id,
    name: organization.name,
    industry: organization.industry,
    dateFounded: organization.dateFounded,
  };
}
