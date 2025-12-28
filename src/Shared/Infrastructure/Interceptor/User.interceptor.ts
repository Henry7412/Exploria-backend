import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '@/Application/Common/Auth/Infrastructure/Services/Auth.service';
import { AuthSignInDto } from '@/Application/Common/Auth/Infrastructure/Dto/AuthSignIn.dto';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return next.handle();
    }

    const decodedToken = this.jwtService.verify(token);
    const authSignInDto = decodedToken as AuthSignInDto;
    const { emailOrPhone } = authSignInDto;

    request.user = await this.authService.setAuthUser(emailOrPhone);

    return next.handle();
  }
}
