import type { Request, Response } from 'express';
import env from '../../config/env';
import { sequelize } from '../../infrastructure/database/sequelize';

export function getHealth(_req: Request, res: Response) {
  return res.status(200).json({
    status: 'OK',
    environment: env.envName,
  });
}

export async function getReadiness(_req: Request, res: Response) {
  const checks = {
    database: { status: 'OK' as 'OK' | 'ERROR' },
    cache: { status: 'OK' as 'OK' | 'ERROR' },
  };

  const databaseResult = await Promise.allSettled([sequelize.authenticate()]);

  if (databaseResult[0].status === 'rejected') {
    checks.database.status = 'ERROR';
  }

  // todo - implement cache check when it is added.
  checks.cache.status = 'OK';

  const ready = checks.database.status === 'OK' && checks.cache.status === 'OK';

  return res.status(ready ? 200 : 503).json({
    status: ready ? 'OK' : 'ERROR',
    environment: env.envName,
    checks,
  });
}
