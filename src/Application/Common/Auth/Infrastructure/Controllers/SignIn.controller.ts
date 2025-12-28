import { Body, Controller, Post } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Public } from '@/Shared/Infrastructure/Decorator/Public.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { AuthSignInDto } from '@/Application/Common/Auth/Infrastructure/Dto/AuthSignIn.dto';
import { SignInUseCase } from '@/Application/Common/Auth/Application/Post/SignIn.useCase';

@Controller('auth')
export class SignInController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Public()
  @Post('sign-in')
  async __invoke(@Body() authSignInDto: AuthSignInDto): Promise<any> {
    const response = await this.signInUseCase.__invoke(authSignInDto);

    return successResponse(this.i18n, 'validation.auth_success', response);
  }
}
