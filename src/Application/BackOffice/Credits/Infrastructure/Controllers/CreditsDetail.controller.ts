import { Controller, Get, Param } from '@nestjs/common';

import { CreditsDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/Credits.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { CreditsDetailUseCase } from '@/Application/BackOffice/Credits/Application/Get/CreditsDetil.useCase';

@Controller('back-office')
export class CreditsDetailController {
  constructor(private readonly creditsDetailUseCase: CreditsDetailUseCase) {}

  @Get('credits/:id/detail')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Param() creditsDto: CreditsDto,
  ): Promise<any> {
    return await this.creditsDetailUseCase.__invoke(authDto, creditsDto);
  }
}
