import compression from '@fastify/compress';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { CsrfFilter } from 'ncsrf';
import { constants } from 'zlib';

import { HttpAdapterAllExceptionFilter } from '@/Shared/Infrastructure/ExceptionFilter/HttpAdapterAll.ExceptionFilter';
import { ResponseInterceptor } from '@/Shared/Infrastructure/Interceptor/Response.interceptor';

export async function AdapterConfigMain(
  app: NestFastifyApplication,
): Promise<NestFastifyApplication> {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    }),
  );

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new HttpAdapterAllExceptionFilter(httpAdapter),
    new CsrfFilter(),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: true,
    credentials: true,
  });

  await app.register(compression, {
    brotliOptions: { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } },
    encodings: ['gzip', 'deflate', 'br'],
    threshold: 1024,
  });

  await app.register(fastifyCsrf);

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  await app.register(multipart, {
    throwFileSizeLimit: true,
    limits: {
      fileSize: 5 * 1024 * 1024,
      fieldNameSize: 5 * 1024 * 1024,
      fields: 5,
      fieldSize: 5 * 1024 * 1024,
      files: 5,
    },
    attachFieldsToBody: true,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '3 minute',
    keyGenerator: (request) => request.ip,
    hook: 'onRequest',
    allowList: (request) => {
      const url = request.url;
      return /^\/api\/v1\/landing\/.*/.test(url);
    },
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message:
        'Has superado el límite de solicitudes permitido. Por favor, intenta de nuevo después de tres minutos.',
    }),
  });

  return app;
}
