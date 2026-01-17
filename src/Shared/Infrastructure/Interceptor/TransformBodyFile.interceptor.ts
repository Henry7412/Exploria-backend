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
export class TransformBodyFileInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<T>) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<any>();
    const { body } = request;

    let file: any = null;

    const incomingFile = body?.file;

    if (!incomingFile) {
      return throwError(
        () => new BadRequestException('Audio file is required'),
      );
    }

    const { mimetype, fieldname, filename, encoding } = incomingFile;

    const allowedMimeTypes = [
      'audio/mpeg', // mp3
      'audio/mp3',
      'audio/wav',
      'audio/x-wav',
      'audio/webm',
      'audio/ogg',
      'audio/mp4',
      'audio/aac',
    ];

    if (!allowedMimeTypes.includes(mimetype)) {
      return throwError(
        () =>
          new BadRequestException(
            `Invalid audio format: ${mimetype}. Allowed: ${allowedMimeTypes.join(
              ', ',
            )}`,
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
      file = {
        fieldname,
        originalname: filename,
        encoding,
        mimetype,
        buffer: buff,
        size: buff.length,
      };

      const MAX_BYTES = 10 * 1024 * 1024;
      if (file.size > MAX_BYTES) {
        return throwError(
          () => new BadRequestException('Audio file is too large (max 10MB)'),
        );
      }
    } catch {
      return throwError(
        () => new BadRequestException('File processing failed'),
      );
    }

    const dtoInstance = plainToInstance(this.dto, {
      ...extractFields(body || {}),
      file,
    });

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

    request.body = dtoInstance;

    return next.handle().pipe(catchError((err) => throwError(() => err)));
  }
}

function extractFields(input: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(input)
      .filter(([, item]) => item?.type === 'field')
      .map(([, item]) => [item.fieldname, item.value]),
  );
}
