import { Injectable } from '@nestjs/common';

import { PlanDto } from '@/Application/BackOffice/Plan/Infrastructure/Dto/Plan.dto';
import { PlansService } from '@/Application/BackOffice/Plan/Infrastructure/Services/Plans.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';

@Injectable()
export class UpdatePlanUserCancelUseCase {
  constructor(private readonly plansService: PlansService) {}

  async __invoke(authDto: AuthDto, planDto: PlanDto): Promise<any> {
    return await this.plansService.updateCancelPlanUser(authDto, planDto);
  }
}
