import type { NextFunction, Request, Response } from 'express';
import { logger } from '../../config/logger';

export const httpHeadersLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.debug(
    {
      method: req.method,
      path: req.originalUrl,
      headers: req.headers,
    },
    'HTTP Request headers',
  );

  res.on('finish', () =>
    logger.debug(
      {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        headers: res.getHeaders(),
      },
      'HTTP Response headers',
    ),
  );

  next();
};
