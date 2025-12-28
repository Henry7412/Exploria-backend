import { Injectable } from '@nestjs/common';

import { PackagesService } from '@/Application/BackOffice/Packages/Infrastructure/Services/Packages.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';

@Injectable()
export class GetPackagesUseCase {
  constructor(private readonly packagesService: PackagesService) {}

  async __invoke(authDto: AuthDto): Promise<any> {
    return await this.packagesService.getPackages(authDto);
  }
}
