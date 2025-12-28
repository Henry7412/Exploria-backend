import { Injectable } from '@nestjs/common';

import { PackageIdDto } from '@/Application/Landing/Credits/Infrastructure/Dto/PackageId.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { LandingCreditsService } from '@/Application/Landing/Credits/Infrastructure/Services/LandingCredits.service';

@Injectable()
export class CreditsUserRequestUseCase {
  constructor(private readonly landingCreditsService: LandingCreditsService) {}

  async __invoke(authDto: AuthDto, packageIdDto: PackageIdDto): Promise<any> {
    return await this.landingCreditsService.requestUserCredits(
      authDto,
      packageIdDto,
    );
  }
}
