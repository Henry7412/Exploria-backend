import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ResponseShape<T = unknown> {
  data: T;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (data instanceof StreamableFile) {
          return data;
        }

        if (Buffer.isBuffer(data)) {
          return data;
        }

        if (typeof data === 'string') {
          return { data };
        }

        return { data };
      }),
    );
  }
}
