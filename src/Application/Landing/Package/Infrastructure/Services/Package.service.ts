import { Injectable } from '@nestjs/common';

import { PackageRepository } from '@/Application/Landing/Package/Infrastructure/Repositories/Package.repository';

@Injectable()
export class PackageService {
  constructor(private readonly packageRepository: PackageRepository) {}

  async listPackage(): Promise<any> {
    const packages = await this.packageRepository.findAllPackages();

    return {
      data: {
        items: packages,
      },
    };
  }
}
