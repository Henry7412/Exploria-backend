import { Body, Controller, Post } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Public } from '@/Shared/Infrastructure/Decorator/Public.decorator';
import { ResetPasswordDto } from '@/Application/Common/Auth/Infrastructure/Dto/ResetPassword.dto';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { ResetPasswordUseCase } from '@/Application/Common/Auth/Application/Post/ResetPassword.useCase';

@Controller('auth')
export class ResetPasswordController {
  constructor(
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly i18n: I18nService,
  ) {}
  @Public()
  @Post('reset-password')
  async __invoke(@Body() resetPasswordDto: ResetPasswordDto) {
    const response = await this.resetPasswordUseCase.__invoke(resetPasswordDto);
    return successResponse(this.i18n, 'message.updated', response);
  }
}
