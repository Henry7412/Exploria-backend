import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
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
    const token = authHeader?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return next.handle();
    }

    try {
      const decodedToken = this.jwtService.verify(token);
      const authSignInDto = decodedToken as AuthSignInDto;
      const { emailOrPhone } = authSignInDto;

      request.user = await this.authService.setAuthUser(emailOrPhone);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return next.handle();
  }
}
