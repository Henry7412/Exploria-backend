import { constants } from 'zlib';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import compress from '@fastify/compress';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';

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

  app.useGlobalFilters(new HttpAdapterAllExceptionFilter(httpAdapter));

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: true,
    credentials: true,
    maxAge: 86400,
  });

  await app.register(compress, {
    brotliOptions: {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 4,
        [constants.BROTLI_PARAM_LGWIN]: 22,
      },
    },
    encodings: ['br', 'gzip', 'deflate'],
    threshold: 1024,
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'https:'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        connectSrc: [`'self'`],
        fontSrc: [`'self'`, 'https:', 'data:'],
        objectSrc: [`'none'`],
        mediaSrc: [`'self'`],
        frameSrc: [`'none'`],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
    },
  });

  // ✅ Sanitización simple
  await app.register((instance: any) => {
    instance.addHook('preHandler', (request: any) => {
      const sanitizeString = (str: string): string =>
        str
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, '')
          .trim();

      const sanitizeObject = (obj: any): any => {
        if (typeof obj === 'string') return sanitizeString(obj);
        if (typeof obj !== 'object' || obj === null) return obj;

        const sanitized = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          if (key.startsWith('$') || key.includes('..') || key.includes('.')) {
            continue;
          }
          sanitized[key] = sanitizeObject(obj[key]);
        }
        return sanitized;
      };

      if (request.body) request.body = sanitizeObject(request.body);
      if (request.query) request.query = sanitizeObject(request.query);
    });
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
    max: process.env.NODE_ENV === 'production' ? 100 : 1000,
    timeWindow: '3 minute',
    keyGenerator: (request) => {
      const authToken = request.headers['authorization'];
      return authToken ? authToken.substring(7) : request.ip;
    },
    hook: 'onRequest',
    allowList: (request) => {
      const url = request.url;
      return /^\/api\/v1\/landing\/.*/.test(url) || /^\/health/.test(url);
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
