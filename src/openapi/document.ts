import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import envConfig from '../config/env';
import { openApiRegistry } from './registry';

export function createOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(openApiRegistry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Node Exercise API',
      version: '1.0.0',
    },
    servers: [{ url: `http://localhost:${envConfig.port}` }],
  });
}
