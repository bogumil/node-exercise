import { OrderModel } from './order.model';
import { OrganizationModel } from './organization.model';
import { UserModel } from './user.model';

export function initDatabaseModels() {
  UserModel.belongsTo(OrganizationModel, { foreignKey: 'organizationId', as: 'organization' });
  OrganizationModel.hasMany(UserModel, { foreignKey: 'organizationId', as: 'users' });

  OrderModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
  UserModel.hasMany(OrderModel, { foreignKey: 'userId', as: 'orders' });

  OrderModel.belongsTo(OrganizationModel, { foreignKey: 'organizationId', as: 'organization' });
  OrganizationModel.hasMany(OrderModel, { foreignKey: 'organizationId', as: 'orders' });
}

export { OrderModel, OrganizationModel, UserModel };
