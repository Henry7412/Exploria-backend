import { Controller, Param, Put } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { UpdateCreditsCancelUseCase } from '@/Application/BackOffice/Credits/Application/Put/UpdateCreditsCancel.useCase';
import { CreditsDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/Credits.dto';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';

@Controller('back-office')
export class UpdateCreditsCancelController {
  constructor(
    private readonly updateCreditsCancelUseCase: UpdateCreditsCancelUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Put('credit/:id/cancel')
  async __invoke(@Param() creditsDto: CreditsDto): Promise<any> {
    const response = await this.updateCreditsCancelUseCase.__invoke(creditsDto);

    return successResponse(this.i18n, 'message.updated', response);
  }
}
