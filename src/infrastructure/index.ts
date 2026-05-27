import { closeDatabaseConnection, connectDatabase } from './database/connect-database';

export async function connectInfrastructure() {
  await connectDatabase();

  console.log('Infrastructure connected');
}

export async function closeInfrastructure() {
  await closeDatabaseConnection();

  console.log('Infrastructure closed');
}
