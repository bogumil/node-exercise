import pino from 'pino';
import envConfig from './env';

const isDevelopment = envConfig.envName === 'dev';

export const logger = pino({
  level: envConfig.logLevel,
  redact: ['headers.authorization', 'headers.cookie', 'headers["set-cookie"]'],
  ...(isDevelopment
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
      }
    : {}),
});
