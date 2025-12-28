import { Injectable } from '@nestjs/common';

import { PackageDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/Package.dto';
import { PackagesService } from '@/Application/BackOffice/Packages/Infrastructure/Services/Packages.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';

@Injectable()
export class DeletePackageUseCase {
  constructor(private readonly packageService: PackagesService) {}

  async __invoke(authDto: AuthDto, packageDto: PackageDto): Promise<any> {
    return await this.packageService.deletePackage(authDto, packageDto);
  }
}
