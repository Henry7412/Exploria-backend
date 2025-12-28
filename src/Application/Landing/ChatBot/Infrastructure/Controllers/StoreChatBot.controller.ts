import { Body, Controller, Post } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { Guest } from '@/Shared/Infrastructure/Decorator/Guest.decorator';
import { StoreChatDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/StoreChatBot.dto';
import { StoreChatBotUseCase } from '@/Application/Landing/ChatBot/Application/Post/StoreChatBot.useCase';

@Controller('landing')
export class StoreChatBotController {
  constructor(
    private readonly storeChatBotUseCase: StoreChatBotUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Guest()
  @Post('chat')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Body() storeChatBotDto: StoreChatDto,
  ): Promise<any> {
    const response = await this.storeChatBotUseCase.__invoke(
      authDto,
      storeChatBotDto,
    );

    const { justCreated, ...dataWithoutJustCreated } = response;

    const msgKey = justCreated ? 'message.created' : 'message.retrieved';

    return successResponse(this.i18n, msgKey, dataWithoutJustCreated);
  }
}
