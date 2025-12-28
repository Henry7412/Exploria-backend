import { Injectable } from '@nestjs/common';

import { PlanDto } from '@/Application/BackOffice/Plan/Infrastructure/Dto/Plan.dto';
import { PlanTypeDto } from '@/Application/BackOffice/Plan/Infrastructure/Dto/PlanType.dto';
import { PlansService } from '@/Application/BackOffice/Plan/Infrastructure/Services/Plans.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';

@Injectable()
export class UpdatePlanUserPaidUseCase {
  constructor(private readonly plansService: PlansService) {}

  async __invoke(
    authDto: AuthDto,
    planDto: PlanDto,
    planTypeDto: PlanTypeDto,
  ): Promise<any> {
    return await this.plansService.updatePaidPlanUser(
      authDto,
      planDto,
      planTypeDto,
    );
  }
}
