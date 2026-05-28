import './openapi/zod-extend';
import express, { type NextFunction, type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { healthRoutes } from './modules/health/health.routes';
import { createOpenApiDocument } from './openapi/document';
import { routes } from './routes';
import { errorHandler } from './shared/errors/error-handler.middleware';
import { NotFoundError } from './shared/errors/http-errors';
import { httpHeadersLogger } from './shared/http/http-headers-logger.middleware';

export const app = express();

app.use(express.json());
app.use(httpHeadersLogger);

app.use(healthRoutes);
app.use('/api', routes);

const openApiDocument = createOpenApiDocument();

app.get('/swagger/json', (_req, res) => {
  res.json(openApiDocument);
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Url not found'));
});

app.use(errorHandler);
