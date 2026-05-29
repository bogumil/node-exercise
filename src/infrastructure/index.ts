import { logger } from '../config/logger';
import { closeDatabaseConnection, connectDatabase } from './database/connect-database';

export async function connectInfrastructure() {
  await connectDatabase();

  logger.info('Infrastructure connected');
}

export async function closeInfrastructure() {
  await closeDatabaseConnection();

  logger.info('Infrastructure closed');
}
