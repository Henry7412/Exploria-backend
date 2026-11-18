import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { JwtAuthGuard } from '@/Shared/Infrastructure/Jwt/Guards/JwtAuth.guard';

import { PackagesUseCase } from '@/Application/BackOffice/Packages/Application/Post/Packages.useCase';
import { PackageItemsDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/PackageItems.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';

@UseGuards(JwtAuthGuard)
@Controller('back-office')
export class PackagesController {
  constructor(
    private readonly packagesUseCase: PackagesUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Post('packages')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Body() packageItemsDto: PackageItemsDto,
  ): Promise<any> {
    const response = await this.packagesUseCase.__invoke(
      authDto,
      packageItemsDto,
    );

    return successResponse(this.i18n, 'message.created', response);
  }
}
