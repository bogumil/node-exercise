import pino from 'pino';
import envConfig from './env';

export const logger = pino({
  level: envConfig.logLevel,
  redact: ['headers.authorization', 'headers.cookie', 'headers["set-cookie"]'],
  transport: {
    target: 'pino-pretty',
  },
});
