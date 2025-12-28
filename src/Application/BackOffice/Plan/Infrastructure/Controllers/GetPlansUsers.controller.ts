import { Controller, Get, Query } from '@nestjs/common';

import { GetPlansUsersUseCase } from '@/Application/BackOffice/Plan/Application/Get/GetPlansUsers.useCase';
import { UsersPlanDto } from '@/Application/BackOffice/Plan/Infrastructure/Dto/UsersPlan.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';

@Controller('back-office')
export class GetPlansUsersController {
  constructor(private readonly getPlansUsersUseCase: GetPlansUsersUseCase) {}

  @Get('users/plan')
  async _invoke(
    @GetAuth() authDto: AuthDto,
    @Query() usersPlanDto: UsersPlanDto,
  ): Promise<any> {
    return await this.getPlansUsersUseCase.__invoke(authDto, usersPlanDto);
  }
}
