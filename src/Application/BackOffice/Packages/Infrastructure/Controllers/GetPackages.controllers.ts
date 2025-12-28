import { Controller, Get } from '@nestjs/common';

import { GetPackagesUseCase } from '@/Application/BackOffice/Packages/Application/Get/GetPackages.useCase';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';

@Controller('back-office')
export class GetPackagesController {
  constructor(private readonly getPackagesUseCase: GetPackagesUseCase) {}

  @Get('packages')
  async __invoke(@GetAuth() authDto: AuthDto): Promise<any> {
    return await this.getPackagesUseCase.__invoke(authDto);
  }
}
