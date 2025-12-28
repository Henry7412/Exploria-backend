import { Body, Controller, Post } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Public } from '@/Shared/Infrastructure/Decorator/Public.decorator';
import { AuthRegisterDto } from '@/Application/Common/Auth/Infrastructure/Dto/AuthRegister.dto';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { AuthRegisterUseCase } from '@/Application/Common/Auth/Application/Post/AuthRegister.useCase';

@Controller('auth')
export class AuthRegisterController {
  constructor(
    private readonly authRegisterUseCase: AuthRegisterUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Post('register')
  @Public()
  async __invoke(@Body() authRegisterDto: AuthRegisterDto) {
    const response = await this.authRegisterUseCase.__invoke(authRegisterDto);

    return successResponse(this.i18n, 'message.created', response);
  }
}
