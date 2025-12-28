import { Injectable } from '@nestjs/common';

import { CreditsPaginationDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/CreditsPagination.dto';
import { BackOfficeCreditsService } from '@/Application/BackOffice/Credits/Infrastructure/Services/BackOfficeCredits.service';

@Injectable()
export class GetCreditsUseCase {
  constructor(
    private readonly backOfficeCreditsService: BackOfficeCreditsService,
  ) {}

  async __invoke(creditsPaginationDto: CreditsPaginationDto): Promise<any> {
    return await this.backOfficeCreditsService.listCredits(
      creditsPaginationDto,
    );
  }
}
