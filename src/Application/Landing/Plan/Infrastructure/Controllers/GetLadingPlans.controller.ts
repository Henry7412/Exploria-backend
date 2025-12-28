import { Controller, Get } from '@nestjs/common';

import { GetLandingPlansUseCase } from '@/Application/Landing/Plan/Application/Get/GetLandingPlans.useCase';
import { Public } from '@/Shared/Infrastructure/Decorator/Public.decorator';

@Controller('landing')
export class GetLadingPlansController {
  constructor(private readonly getLadingPlansUseCase: GetLandingPlansUseCase) {}

  @Public()
  @Get('plans/available')
  async __invoke(): Promise<any> {
    return await this.getLadingPlansUseCase.__invoke();
  }
}
