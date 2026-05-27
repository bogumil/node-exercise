import { initDatabaseModels } from './models';
import { sequelize } from './sequelize';

export async function connectDatabase(): Promise<void> {
  initDatabaseModels();

  // await sequelize.authenticate();

  // todo - move to migrations later
  await sequelize.sync({ alter: true });
  console.log('All models were synchronized successfully.');
}

export async function closeDatabaseConnection() {
  await sequelize.close();

  console.log('Database connection closed.');
}
