import { Controller, Get, Param } from '@nestjs/common';

import { PackageDetailUseCase } from '@/Application/BackOffice/Packages/Application/Get/PackageDetail.useCase';
import { PackageDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/Package.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';

@Controller('back-office')
export class PackageDetailController {
  constructor(private readonly packageDetailUseCase: PackageDetailUseCase) {}

  @Get('packages/:id')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Param() packageDto: PackageDto,
  ): Promise<any> {
    return await this.packageDetailUseCase.__invoke(authDto, packageDto);
  }
}
