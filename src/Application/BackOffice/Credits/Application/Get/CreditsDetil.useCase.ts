import { Injectable } from '@nestjs/common';

import { CreditsDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/Credits.dto';
import { BackOfficeCreditsService } from '@/Application/BackOffice/Credits/Infrastructure/Services/BackOfficeCredits.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';

@Injectable()
export class CreditsDetailUseCase {
  constructor(
    private readonly backOfficeCreditsService: BackOfficeCreditsService,
  ) {}

  async __invoke(authDto: AuthDto, creditsDto: CreditsDto): Promise<any> {
    return await this.backOfficeCreditsService.creditsDetail(
      authDto,
      creditsDto,
    );
  }
}
