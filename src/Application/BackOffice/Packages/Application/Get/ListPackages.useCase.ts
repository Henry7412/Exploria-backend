import { Injectable } from '@nestjs/common';

import { PackagePaginationDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/PackagePagination.dto';
import { PackagesService } from '@/Application/BackOffice/Packages/Infrastructure/Services/Packages.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';

@Injectable()
export class ListPackagesUseCase {
  constructor(private readonly packageService: PackagesService) {}

  async __invoke(
    authDto: AuthDto,
    packagePaginationDto: PackagePaginationDto,
  ): Promise<any> {
    return await this.packageService.listPackages(
      authDto,
      packagePaginationDto,
    );
  }
}
