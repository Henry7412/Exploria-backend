import { Controller, Get, Query } from '@nestjs/common';

import { GetCreditsUseCase } from '@/Application/BackOffice/Credits/Application/Get/GetCredits.useCase';
import { CreditsPaginationDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/CreditsPagination.dto';

@Controller('back-office')
export class GetCreditsController {
  constructor(private readonly getCreditsUseCase: GetCreditsUseCase) {}

  @Get('credits')
  async __invoke(
    @Query() creditPaginationDto: CreditsPaginationDto,
  ): Promise<any> {
    return await this.getCreditsUseCase.__invoke(creditPaginationDto);
  }
}
