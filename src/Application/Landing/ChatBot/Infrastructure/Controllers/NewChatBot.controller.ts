import { Body, Controller, Post } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { Guest } from '@/Shared/Infrastructure/Decorator/Guest.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { StoreChatDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/StoreChatBot.dto';
import { NewChatBotUseCase } from '@/Application/Landing/ChatBot/Application/Post/NewChatBot.useCase';

@Controller('landing')
export class NewChatBotController {
  constructor(
    private readonly newChatBotUseCase: NewChatBotUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Guest()
  @Post('chat/new')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Body() storeChatDto: StoreChatDto,
  ): Promise<any> {
    const response = await this.newChatBotUseCase.__invoke(
      authDto,
      storeChatDto,
    );

    return successResponse(this.i18n, 'message.created', response);
  }
}
