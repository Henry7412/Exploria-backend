import { Body, Controller, Post } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Public } from '@/Shared/Infrastructure/Decorator/Public.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { ForgotPasswordDto } from '@/Application/Common/Auth/Infrastructure/Dto/ForgotPassword.dto';
import { ForgotPasswordUseCase } from '@/Application/Common/Auth/Application/Post/ForgotPassword.useCase';

@Controller('auth')
export class ForgotPasswordController {
  constructor(
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Public()
  @Post('forgot-password')
  async __invoke(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const response =
      await this.forgotPasswordUseCase.__invoke(forgotPasswordDto);

    return successResponse(this.i18n, 'message.updated', response);
  }
}
