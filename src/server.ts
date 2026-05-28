import './openapi/zod-extend';
import { app } from './app';
import envConfig from './config/env';
import { connectInfrastructure } from './infrastructure';

async function bootstrap() {
  try {
    await connectInfrastructure();

    app.listen(envConfig.port, () => {
      console.log(`Server started on port ${envConfig.port}`);
    });

    // todo - handle process SIGINT and SIGTERM.
  } catch (error) {
    console.log('Unable to start the app', error);
    process.exit(1);
  }
}

void bootstrap();
