import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/Shared/Infrastructure/Jwt/Guards/JwtAuth.guard';

import { ListPackagesUseCase } from '@/Application/BackOffice/Packages/Application/Get/ListPackages.useCase';
import { PackagePaginationDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/PackagePagination.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';

@UseGuards(JwtAuthGuard)
@Controller('back-office')
export class ListPackagesController {
  constructor(private readonly listPackagesUseCase: ListPackagesUseCase) {}

  @Get('packages-list')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Query() packagePaginationDto: PackagePaginationDto,
  ): Promise<any> {
    return await this.listPackagesUseCase.__invoke(
      authDto,
      packagePaginationDto,
    );
  }
}
