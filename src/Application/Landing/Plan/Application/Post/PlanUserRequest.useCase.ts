import { Injectable } from '@nestjs/common';

import { SubscriptionIdDto } from '@/Application/Landing/Plan/Infrastructure/Dto/SubscriptionId.Dto';
import { LandingPlanService } from '@/Application/Landing/Plan/Infrastructure/Services/LandingPlan.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';

@Injectable()
export class PlanUserRequestUseCase {
  constructor(private readonly landingPlanService: LandingPlanService) {}

  async __invoke(
    authDto: AuthDto,
    subscriptionIdDto: SubscriptionIdDto,
  ): Promise<any> {
    return await this.landingPlanService.planUserRequest(
      authDto,
      subscriptionIdDto,
    );
  }
}
