import type { Organization } from '../organizations/organization.types';
import type { User } from '../users/user.types';

export type Order = {
  id: string;
  organizationId: string;
  userId: string;
  totalAmount: number;
  orderDate: string;
};

export type OrderWithRelations = Order & {
  user: User;
  organization: Organization;
};
