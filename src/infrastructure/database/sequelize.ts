import { Sequelize } from 'sequelize';

import envConfig from '../../config/env';

export const sequelize = new Sequelize(envConfig.db.database, envConfig.db.user, envConfig.db.password, {
  host: envConfig.db.host,
  port: envConfig.db.port,
  dialect: envConfig.db.dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30_000,
    idle: 10_000,
  },
});
