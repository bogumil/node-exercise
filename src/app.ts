import express, { type Request, type Response } from 'express';
import env from './config/env';

export const app = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    environment: env.envName,
  });
});
