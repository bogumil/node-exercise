import { ValidationError } from '../../shared/http-errors';
import { organizationRepository } from './organization.repository';
import type { CreateOrganizationBodyDto } from './organization.schemas';
import type { Organization, OrganizationResponseDto } from './organization.types';

export const organizationService = {
  async create(dto: CreateOrganizationBodyDto): Promise<OrganizationResponseDto> {
    if (dto.dateFounded && new Date(dto.dateFounded).getTime() > Date.now()) {
      throw new ValidationError({ dateFounded: ['Date founded has to be before the current timestamp'] });
    }

    const organization = await organizationRepository.create(dto);

    return toOrganizationResponseDto(organization);
  },
};

function toOrganizationResponseDto(organization: Organization): OrganizationResponseDto {
  return {
    id: organization.id,
    name: organization.name,
    industry: organization.industry,
    dateFounded: organization.dateFounded,
  };
}
