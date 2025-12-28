import { Body, Controller, Param, Put } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { DisablePackageUseCase } from '@/Application/BackOffice/Packages/Application/Put/DisablePackage.useCase';
import { PackageDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/Package.dto';
import { PackageDisableDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/PackageDisable.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';

@Controller('back-office')
export class DisablePackageController {
  constructor(
    private readonly disablePackageUseCase: DisablePackageUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Put('packages/:id/disable')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Param() packageDto: PackageDto,
    @Body() packageDisableDto: PackageDisableDto,
  ): Promise<any> {
    const response = await this.disablePackageUseCase.__invoke(
      authDto,
      packageDto,
      packageDisableDto,
    );

    return successResponse(this.i18n, 'message.updated', response);
  }
}
