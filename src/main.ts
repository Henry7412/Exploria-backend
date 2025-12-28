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
  let app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: true,
      forceCloseConnections: true,
    }),
    { bufferLogs: true },
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app = await AdapterConfigMain(app);

  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
