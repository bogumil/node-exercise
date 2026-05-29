import type { Server } from 'node:net';
import { app } from './app';
import envConfig from './config/env';
import { logger } from './config/logger';
import { closeInfrastructure, connectInfrastructure } from './infrastructure';

let server: Server | undefined;
let isShuttingDown = false;

async function shutdown(reason: string, exitCode: number, error?: unknown): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  if (error) {
    logger.fatal({ err: error, reason }, 'Fatal error, shutting down');
  } else {
    logger.info({ reason }, 'Shutting down');
  }

  try {
    if (server) {
      await closeServer(server);
    }

    await closeInfrastructure();

    logger.info({ reason }, 'Shutdown completed');
    process.exit(exitCode);
  } catch (shutdownError) {
    logger.fatal({ err: shutdownError, reason }, 'Shutdown failed');
    process.exit(1);
  }
}

function registerProcessHandlers(): void {
  process.once('SIGINT', () => {
    void shutdown('SIGINT', 0);
  });

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM', 0);
  });

  process.on('uncaughtException', (error) => {
    void shutdown('uncaughtException', 1, error);
  });

  process.on('unhandledRejection', (reason) => {
    void shutdown('unhandledRejection', 1, reason);
  });
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function bootstrap(): Promise<void> {
  try {
    registerProcessHandlers();

    await connectInfrastructure();

    server = app.listen(envConfig.port, () => {
      logger.info({ port: envConfig.port }, 'Server started');
    });
  } catch (error) {
    logger.fatal({ err: error }, 'Unable to start the app');
    process.exit(1);
  }
}

void bootstrap();
