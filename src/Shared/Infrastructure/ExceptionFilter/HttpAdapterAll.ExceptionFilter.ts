import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class HttpAdapterAllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const response = exception.getResponse();
    const httpStatus = exception.getStatus();

    let responseBody: { message: string[]; error: string };

    if (typeof response === 'object' && response !== null) {
      const { message = ['Validation failed'], error = 'Bad Request' } =
        response as { message?: string[]; error?: string };
      responseBody = { message, error };
    } else {
      responseBody = {
        message: [response as string],
        error: 'Bad Request',
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
