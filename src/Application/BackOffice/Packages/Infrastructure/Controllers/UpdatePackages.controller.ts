import { Body, Controller, Param, Put } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { UpdatePackagesUseCase } from '@/Application/BackOffice/Packages/Application/Put/UpdatePackages.useCase';
import { PackageDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/Package.dto';
import { PackageItemsDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/PackageItems.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';

@Controller('back-office')
export class UpdatePackagesController {
  constructor(
    private readonly updatePackagesCollectionUseCase: UpdatePackagesUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Put('packages/:id')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Param() packageDto: PackageDto,
    @Body() packageItemsDto: PackageItemsDto,
  ): Promise<any> {
    const response = await this.updatePackagesCollectionUseCase.__invoke(
      authDto,
      packageDto,
      packageItemsDto,
    );

    return successResponse(this.i18n, 'message.updated', response);
  }
}
