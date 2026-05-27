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
import type { UserModel } from './user.model';

export class OrganizationModel extends Model<
  InferAttributes<OrganizationModel>,
  InferCreationAttributes<OrganizationModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare industry: string | null | undefined;
  declare dateFounded: string | null | undefined; // in YYYY-MM-DD format

  declare users?: NonAttribute<UserModel[]>;
  declare orders?: NonAttribute<OrderModel[]>;
}

OrganizationModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateFounded: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  { sequelize, modelName: 'Organization', tableName: 'organizations', timestamps: false, underscored: true },
);
