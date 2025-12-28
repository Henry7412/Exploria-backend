import { Controller, Delete, Param } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { DeletePackageUseCase } from '@/Application/BackOffice/Packages/Application/Delete/DeletePackage.useCase';
import { PackageDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/Package.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';

@Controller('back-office')
export class DeletePackageController {
  constructor(
    private readonly deletePackageUseCase: DeletePackageUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Delete('packages/:id')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Param() packageDto: PackageDto,
  ): Promise<any> {
    const response = await this.deletePackageUseCase.__invoke(
      authDto,
      packageDto,
    );

    return successResponse(this.i18n, 'message.deleted', response);
  }
}
