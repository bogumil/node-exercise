import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
} from 'sequelize';
import { sequelize } from '../sequelize';
import { OrganizationModel } from './organization.model';
import { UserModel } from './user.model';

export class OrderModel extends Model<InferAttributes<OrderModel>, InferCreationAttributes<OrderModel>> {
  declare id: CreationOptional<string>;
  declare organizationId: string;
  declare userId: string;
  declare orderDate: Date;
  declare totalAmount: number;

  declare user?: NonAttribute<UserModel>;
  declare organization?: NonAttribute<OrganizationModel>;
}

OrderModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: OrganizationModel,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    orderDate: { type: DataTypes.DATE, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(12, 2).UNSIGNED, allowNull: false },
  },
  { sequelize, modelName: 'Order', tableName: 'orders', timestamps: false, underscored: true },
);
