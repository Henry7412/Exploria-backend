import { Controller, Param, Put } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { UpdatePlanUserCancelUseCase } from '@/Application/BackOffice/Plan/Application/Put/UpdatePlanUserCancel.useCase';
import { PlanDto } from '@/Application/BackOffice/Plan/Infrastructure/Dto/Plan.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';

@Controller('back-office')
export class UpdatePlanUserCancelController {
  constructor(
    private readonly updatePlanUserCancelUseCase: UpdatePlanUserCancelUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Put('user/plan/:id/cancel')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Param() planDto: PlanDto,
  ): Promise<any> {
    const response = await this.updatePlanUserCancelUseCase.__invoke(
      authDto,
      planDto,
    );

    return successResponse(this.i18n, 'message.updated', response);
  }
}
