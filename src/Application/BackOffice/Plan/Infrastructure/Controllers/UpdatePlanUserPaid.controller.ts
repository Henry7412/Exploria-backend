import { Body, Controller, Param, Put } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { UpdatePlanUserPaidUseCase } from '@/Application/BackOffice/Plan/Application/Put/UpdatePlanUserPaid.useCase';
import { PlanDto } from '@/Application/BackOffice/Plan/Infrastructure/Dto/Plan.dto';
import { PlanTypeDto } from '@/Application/BackOffice/Plan/Infrastructure/Dto/PlanType.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';

@Controller('back-office')
export class UpdatePlanUserPaidController {
  constructor(
    private readonly updatePlanUserPaidUseCase: UpdatePlanUserPaidUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Put('user/plan/:id/paid')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Param() planDto: PlanDto,
    @Body() planTypeDto: PlanTypeDto,
  ): Promise<any> {
    const response = await this.updatePlanUserPaidUseCase.__invoke(
      authDto,
      planDto,
      planTypeDto,
    );

    return successResponse(this.i18n, 'message.updated', response);
  }
}
