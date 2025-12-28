import { Injectable } from '@nestjs/common';

import { UsersPlanDto } from '@/Application/BackOffice/Plan/Infrastructure/Dto/UsersPlan.dto';
import { PlansService } from '@/Application/BackOffice/Plan/Infrastructure/Services/Plans.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';

@Injectable()
export class GetPlansUsersUseCase {
  constructor(private readonly plansService: PlansService) {}

  async __invoke(authDto: AuthDto, usersPlanDto: UsersPlanDto): Promise<any> {
    return await this.plansService.listUsersPlan(authDto, usersPlanDto);
  }
}
