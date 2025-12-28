import { Injectable } from '@nestjs/common';

import { PackageDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/Package.dto';
import { PackageItemsDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/PackageItems.dto';
import { PackagesService } from '@/Application/BackOffice/Packages/Infrastructure/Services/Packages.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';

@Injectable()
export class UpdatePackagesUseCase {
  constructor(private readonly packagesService: PackagesService) {}

  async __invoke(
    authDto: AuthDto,
    packageDto: PackageDto,
    packageItemsDto: PackageItemsDto,
  ): Promise<any> {
    return await this.packagesService.updatePackage(
      authDto,
      packageDto,
      packageItemsDto,
    );
  }
}
