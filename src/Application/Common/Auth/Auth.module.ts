import { Module } from '@nestjs/common';
import { AuthRegisterController } from '@/Application/Common/Auth/Infrastructure/Controllers/AuthRegister.controller';
import { AuthService } from '@/Application/Common/Auth/Infrastructure/Services/Auth.service';
import { AuthRegisterUseCase } from '@/Application/Common/Auth/Application/Post/AuthRegister.useCase';
import { JwtModule } from '@/Shared/Infrastructure/Jwt/Jwt.module';
import { UserModule } from '@/Application/Common/User/User.module';
import { SignInController } from '@/Application/Common/Auth/Infrastructure/Controllers/SignIn.controller';
import { SignInUseCase } from '@/Application/Common/Auth/Application/Post/SignIn.useCase';
import { JwtStrategy } from '@/Application/Common/Auth/Infrastructure/Strategies/Jwt.strategy';
import { RedisConfigMain } from '@/Shared/Infrastructure/Config/Redis/RedisConfig.main';
import { UserInterceptor } from '@/Shared/Infrastructure/Interceptor/User.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ForgotPasswordUseCase } from '@/Application/Common/Auth/Application/Post/ForgotPassword.useCase';
import { ResetPasswordUseCase } from '@/Application/Common/Auth/Application/Post/ResetPassword.useCase';
import { ForgotPasswordController } from '@/Application/Common/Auth/Infrastructure/Controllers/ForgotPassword.controller';
import { ResetPasswordController } from '@/Application/Common/Auth/Infrastructure/Controllers/ResetPassword.controller';
import { MailService } from '@/Shared/Infrastructure/Mail/Mail.service';

@Module({
  imports: [JwtModule, UserModule, RedisConfigMain],
  controllers: [
    AuthRegisterController,
    SignInController,
    ForgotPasswordController,
    ResetPasswordController,
  ],
  providers: [
    AuthService,
    AuthRegisterUseCase,
    SignInUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    JwtStrategy,
    MailService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
  ],
  exports: [AuthService, MailService],
})
export class AuthModule {}
