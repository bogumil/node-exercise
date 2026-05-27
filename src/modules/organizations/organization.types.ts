export type Organization = {
  id: string;
  name: string;
  industry: string | null | undefined;
  dateFounded: string | null | undefined;
};

export type OrganizationResponseDto = Pick<Organization, 'id' | 'name' | 'industry' | 'dateFounded'>;
