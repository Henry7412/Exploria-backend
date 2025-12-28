import { Body, Controller, Param, Put } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { UpdateCreditsPaidUseCase } from '@/Application/BackOffice/Credits/Application/Put/UpdateCreditsPaid.useCase';
import { CreditTypeDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/CreditType.dto';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';

import { CreditsDto } from '../Dto/Credits.dto';

@Controller('back-office')
export class UpdateCreditsPaidController {
  constructor(
    private readonly updateCreditsApproveUseCase: UpdateCreditsPaidUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Put('credit/:id/paid')
  async __invoke(
    @Param() creditsDto: CreditsDto,
    @Body() creditTypeDto: CreditTypeDto,
  ): Promise<any> {
    const response = await this.updateCreditsApproveUseCase.__invoke(
      creditsDto,
      creditTypeDto,
    );
    return successResponse(this.i18n, 'message.updated', response);
  }
}
