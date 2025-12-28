import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ListPackageUseCase } from '@/Application/Landing/Package/Application/Get/ListPackage.useCase';
import { ListPackageController } from '@/Application/Landing/Package/Infrastructure/Controllers/ListPackage.controller';
import { PackageRepository } from '@/Application/Landing/Package/Infrastructure/Repositories/Package.repository';
import { PackageService } from '@/Application/Landing/Package/Infrastructure/Services/Package.service';
import { PackagesSchema } from '@/Shared/Domain/Schemas/Packages.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Packages', schema: PackagesSchema }]),
  ],
  controllers: [ListPackageController],
  providers: [ListPackageUseCase, PackageService, PackageRepository],
  exports: [PackageService, PackageRepository],
})
export class PackageModule {}
