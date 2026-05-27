import express, { type NextFunction, type Request, type Response } from 'express';
import env from './config/env';
import { routes } from './routes';
import { errorHandler } from './shared/error-handler.middleware';
import { NotFoundError } from './shared/http-errors';

export const app = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    environment: env.envName,
  });
});

app.use('/api', routes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Url not found'));
});

app.use(errorHandler);
