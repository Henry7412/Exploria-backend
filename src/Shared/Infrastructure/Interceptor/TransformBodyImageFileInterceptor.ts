import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TransformBodyImageFileInterceptor<T> implements NestInterceptor {
  private readonly maxBytes = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  constructor(private readonly dto: ClassConstructor<T>) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<any>();
    const { body } = request;

    const incomingFile = body?.file;

    const dtoInstance = plainToInstance(this.dto, extractFields(body || {}));
    const errors = await validate(dtoInstance as object);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap((err) =>
        Object.values(err.constraints || {}),
      );
      return throwError(
        () =>
          new BadRequestException({
            message: errorMessages,
            error: 'Bad Request',
          }),
      );
    }

    if (!incomingFile) {
      request.body = dtoInstance;
      request.file = null; // por claridad
      return next.handle().pipe(catchError((err) => throwError(() => err)));
    }

    const { mimetype, fieldname, filename, encoding } = incomingFile;

    if (!this.allowedMimeTypes.includes(mimetype)) {
      return throwError(
        () =>
          new BadRequestException(
            `Invalid image format: ${mimetype}. Allowed: ${this.allowedMimeTypes.join(', ')}`,
          ),
      );
    }

    if (typeof incomingFile.toBuffer !== 'function') {
      return throwError(
        () => new BadRequestException('Invalid uploaded file payload'),
      );
    }

    try {
      const buff = await incomingFile.toBuffer();

      if (buff.length > this.maxBytes) {
        return throwError(
          () =>
            new BadRequestException(
              `Image file is too large (max ${Math.floor(this.maxBytes / (1024 * 1024))}MB)`,
            ),
        );
      }

      request.file = {
        fieldname,
        originalname: filename,
        encoding,
        mimetype,
        size: buff.length,
        bufferBase64: buff.toString('base64'),
      };

      request.body = dtoInstance;
      return next.handle().pipe(catchError((err) => throwError(() => err)));
    } catch {
      return throwError(
        () => new BadRequestException('File processing failed'),
      );
    }
  }
}

function extractFields(input: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(input)
      .filter(([, item]) => item?.type === 'field')
      .map(([, item]) => [item.fieldname, item.value]),
  );
}
