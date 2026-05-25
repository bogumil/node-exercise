import { app } from './app';
import env from './config/env';

async function bootstrap() {
  try {
    app.listen(env.port, () => {
      console.log(`Server started on port ${env.port}`);
    });
  } catch (error) {
    console.log('Unable to start the app', error);
    process.exit(1);
  }
}

void bootstrap();
