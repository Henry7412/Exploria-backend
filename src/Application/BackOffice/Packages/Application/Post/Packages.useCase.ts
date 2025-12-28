import { Injectable } from '@nestjs/common';

import { PackageItemsDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/PackageItems.dto';
import { PackagesService } from '@/Application/BackOffice/Packages/Infrastructure/Services/Packages.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';

@Injectable()
export class PackagesUseCase {
  constructor(private readonly packagesService: PackagesService) {}

  async __invoke(
    authDto: AuthDto,
    packageItemsDto: PackageItemsDto,
  ): Promise<any> {
    return await this.packagesService.storePackage(authDto, packageItemsDto);
  }
}
