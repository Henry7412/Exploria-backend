import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { JwtAuthGuard } from '@/Shared/Infrastructure/Jwt/Guards/JwtAuth.guard';

import { PackageIdDto } from '@/Application/Landing/Credits/Infrastructure/Dto/PackageId.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { CreditsUserRequestUseCase } from '@/Application/Landing/Credits/Application/Post/CreditUserRequest.useCase';

@Controller('landing')
export class CreditsUserRequestController {
  constructor(
    private readonly creditsUserRequestUseCase: CreditsUserRequestUseCase,
    private readonly i18n: I18nService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('credits/request')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Body() packageIdDto: PackageIdDto,
  ): Promise<any> {
    const response = await this.creditsUserRequestUseCase.__invoke(
      authDto,
      packageIdDto,
    );

    return successResponse(this.i18n, 'message.updated', response);
  }
}
