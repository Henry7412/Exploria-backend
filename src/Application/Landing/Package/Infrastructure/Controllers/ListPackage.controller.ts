import { Controller, Get } from '@nestjs/common';

import { ListPackageUseCase } from '@/Application/Landing/Package/Application/Get/ListPackage.useCase';
import { Public } from '@/Shared/Infrastructure/Decorator/Public.decorator';

@Controller('landing')
export class ListPackageController {
  constructor(private readonly listPackageUseCase: ListPackageUseCase) {}

  @Public()
  @Get('packages/list')
  async __invoke(): Promise<any> {
    return await this.listPackageUseCase.__invoke();
  }
}
