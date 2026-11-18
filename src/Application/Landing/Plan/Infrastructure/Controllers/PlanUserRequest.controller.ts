import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { JwtAuthGuard } from '@/Shared/Infrastructure/Jwt/Guards/JwtAuth.guard';

import { PlanUserRequestUseCase } from '@/Application/Landing/Plan/Application/Post/PlanUserRequest.useCase';
import { SubscriptionIdDto } from '@/Application/Landing/Plan/Infrastructure/Dto/SubscriptionId.Dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';

@Controller('landing')
export class PlanUserRequestController {
  constructor(
    private readonly planUserRequestUSeCase: PlanUserRequestUseCase,
    private readonly i18n: I18nService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('plan/user/request')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Body() subscriptionIdDto: SubscriptionIdDto,
  ): Promise<any> {
    const response = await this.planUserRequestUSeCase.__invoke(
      authDto,
      subscriptionIdDto,
    );
    return successResponse(this.i18n, 'message.updated', response);
  }
}
