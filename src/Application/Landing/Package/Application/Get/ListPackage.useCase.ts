import { Injectable } from '@nestjs/common';

import { PackageService } from '@/Application/Landing/Package/Infrastructure/Services/Package.service';

@Injectable()
export class ListPackageUseCase {
  constructor(private readonly packageService: PackageService) {}

  async __invoke(): Promise<any> {
    return await this.packageService.listPackage();
  }
}
