import express, { type Request, type Response } from 'express';
import env from './config/env';
import { routes } from './routes';

export const app = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    environment: env.envName,
  });
});

app.use('/api', routes);

// todo - add error handler middleware
