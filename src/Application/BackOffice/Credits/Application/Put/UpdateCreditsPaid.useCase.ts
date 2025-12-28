import { Injectable } from '@nestjs/common';

import { CreditsDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/Credits.dto';
import { CreditTypeDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/CreditType.dto';
import { BackOfficeCreditsService } from '@/Application/BackOffice/Credits/Infrastructure/Services/BackOfficeCredits.service';

@Injectable()
export class UpdateCreditsPaidUseCase {
  constructor(
    private readonly backOfficeCreditsService: BackOfficeCreditsService,
  ) {}

  async __invoke(
    creditsDto: CreditsDto,
    creditTypeDto: CreditTypeDto,
  ): Promise<any> {
    return await this.backOfficeCreditsService.updatePaidCredits(
      creditsDto,
      creditTypeDto,
    );
  }
}
