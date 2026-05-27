import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
} from 'sequelize';
import { sequelize } from '../sequelize';
import type { OrderModel } from './order.model';
import { OrganizationModel } from './organization.model';

export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<string>;
  declare organizationId: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string | null;
  declare dateCreated: CreationOptional<Date>;

  declare organization?: NonAttribute<OrganizationModel>;
  declare orders?: NonAttribute<OrderModel[]>;
}

UserModel.init(
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateCreated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'User', tableName: 'users', timestamps: false, underscored: true },
);
