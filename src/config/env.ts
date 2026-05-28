const envConfig = {
  db: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    rootPassword: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE || '',
    user: process.env.MYSQL_USER || '',
    password: process.env.MYSQL_PASSWORD,
    dialect: 'mysql' as const,
  },
  envName: process.env.ENV_NAME || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  sqlLogging: process.env.SQL_LOGGING === 'true',
};

export default envConfig;
