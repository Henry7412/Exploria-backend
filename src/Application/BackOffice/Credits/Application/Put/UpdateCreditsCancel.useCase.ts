import { Injectable } from '@nestjs/common';

import { CreditsDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/Credits.dto';
import { BackOfficeCreditsService } from '@/Application/BackOffice/Credits/Infrastructure/Services/BackOfficeCredits.service';

@Injectable()
export class UpdateCreditsCancelUseCase {
  constructor(
    private readonly backOfficeCreditsService: BackOfficeCreditsService,
  ) {}

  async __invoke(creditsDto: CreditsDto): Promise<any> {
    return await this.backOfficeCreditsService.updateCancelCredits(creditsDto);
  }
}
