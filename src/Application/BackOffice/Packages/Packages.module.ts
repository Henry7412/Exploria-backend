import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BackOfficeCreditsModule } from '@/Application/BackOffice/Credits/BackOfficeCredits.module';
import { GetPackagesUseCase } from '@/Application/BackOffice/Packages/Application/Get/GetPackages.useCase';
import { ListPackagesUseCase } from '@/Application/BackOffice/Packages/Application/Get/ListPackages.useCase';
import { PackageDetailUseCase } from '@/Application/BackOffice/Packages/Application/Get/PackageDetail.useCase';
import { PackagesUseCase } from '@/Application/BackOffice/Packages/Application/Post/Packages.useCase';
import { DisablePackageUseCase } from '@/Application/BackOffice/Packages/Application/Put/DisablePackage.useCase';
import { UpdatePackagesUseCase } from '@/Application/BackOffice/Packages/Application/Put/UpdatePackages.useCase';
import { DeletePackageController } from '@/Application/BackOffice/Packages/Infrastructure/Controllers/DeletePackage.controller';
import { DisablePackageController } from '@/Application/BackOffice/Packages/Infrastructure/Controllers/DisablePackage.controller';
import { GetPackagesController } from '@/Application/BackOffice/Packages/Infrastructure/Controllers/GetPackages.controllers';
import { ListPackagesController } from '@/Application/BackOffice/Packages/Infrastructure/Controllers/ListPackages.contorller';
import { PackageDetailController } from '@/Application/BackOffice/Packages/Infrastructure/Controllers/PackageDetail.controller';
import { UpdatePackagesController } from '@/Application/BackOffice/Packages/Infrastructure/Controllers/UpdatePackages.controller';
import { PackagesRepository } from '@/Application/BackOffice/Packages/Infrastructure/Repositories/Packages.repository';
import { PackagesSchema } from '@/Shared/Domain/Schemas/Packages.schema';

import { DeletePackageUseCase } from './Application/Delete/DeletePackage.useCase';
import { PackagesController } from './Infrastructure/Controllers/Packages.controller';
import { PackagesService } from './Infrastructure/Services/Packages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Packages', schema: PackagesSchema }]),
    forwardRef(() => BackOfficeCreditsModule),
  ],
  controllers: [
    GetPackagesController,
    PackagesController,
    UpdatePackagesController,
    DeletePackageController,
    DisablePackageController,
    ListPackagesController,
    PackageDetailController,
  ],
  providers: [
    PackagesRepository,
    PackagesService,
    GetPackagesUseCase,
    PackagesUseCase,
    UpdatePackagesUseCase,
    DeletePackageUseCase,
    DisablePackageUseCase,
    ListPackagesUseCase,
    PackageDetailUseCase,
  ],
  exports: [PackagesRepository, PackagesService],
})
export class PackagesModule {}
