import { Injectable } from '@nestjs/common';

import { LandingPlanService } from '@/Application/Landing/Plan/Infrastructure/Services/LandingPlan.service';

@Injectable()
export class GetLandingPlansUseCase {
  constructor(private readonly landingPlanService: LandingPlanService) {}

  async __invoke(): Promise<any> {
    return await this.landingPlanService.getLandingPlans();
  }
}
