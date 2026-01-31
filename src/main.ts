import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';

import { AppModule } from '@/app.module';
import { AdapterConfigMain } from '@/Shared/Infrastructure/Config/AdapterConfig.main';

const port = process.env.PORT || 3001;

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('🚀 Starting application bootstrap...');

    logger.log('📦 Creating NestJS application...');
    let app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        trustProxy: true,
        forceCloseConnections: true,
      }),
      {
        bufferLogs: false,
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
      },
    );

    logger.log('🔧 Configuring container...');
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    logger.log('⚙️  Applying adapter configuration...');
    app = await AdapterConfigMain(app);

    logger.log(`🌐 Starting server on port ${port}...`);
    await app.listen(port, '0.0.0.0');
    logger.log(`✅ Server running on http://localhost:${port}`);

    if (process.send) {
      process.send('ready');
      logger.log('"Ready" signal sent to PM2');
    }
  } catch (error) {
    logger.error(`❌ Error during startup: ${error}`);
    logger.error(error.stack);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error(`❌ Fatal error during startup: ${err}`);
  logger.error(err.stack);
  process.exit(1);
});
