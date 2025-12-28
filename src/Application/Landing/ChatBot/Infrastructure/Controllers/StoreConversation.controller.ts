import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { StoreConversationUseCase } from '@/Application/Landing/ChatBot/Application/Post/StoreConversation.useCase';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { Guest } from '@/Shared/Infrastructure/Decorator/Guest.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { MessagesDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/Message.dto';
import { ChatIdDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatId.dto';
import { SubscriptionGuardInterceptor } from '@/Shared/Infrastructure/Interceptor/GeminiInterceptor/SubscriptionGuardInterceptor';

@Controller('landing')
export class StoreConversationController {
  constructor(
    private readonly storeConversationUseCase: StoreConversationUseCase,
    private readonly i18n: I18nService,
  ) {}

  @UseInterceptors(SubscriptionGuardInterceptor)
  @Guest()
  @Post('chat/:chatId/message')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Param() chatIdDto: ChatIdDto,
    @Body() messagesDto: MessagesDto,
  ): Promise<any> {
    const response = await this.storeConversationUseCase.__invoke(
      authDto,
      chatIdDto,
      messagesDto,
    );
    return successResponse(this.i18n, 'message.created', response);
  }
}
