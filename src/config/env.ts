const env = {
  envName: process.env.ENV_NAME || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
};

export default env;
