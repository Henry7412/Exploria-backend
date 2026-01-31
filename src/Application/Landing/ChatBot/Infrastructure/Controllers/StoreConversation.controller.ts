import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { StoreConversationUseCase } from '@/Application/Landing/ChatBot/Application/Post/StoreConversation.useCase';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { Guest } from '@/Shared/Infrastructure/Decorator/Guest.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';

import { MessagesDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/Message.dto';
import { ChatIdDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatId.dto';

import { SubscriptionGuardInterceptor } from '@/Shared/Infrastructure/Interceptor/GeminiInterceptor/SubscriptionGuardInterceptor';
import { TransformBodyImageFileInterceptor } from '@/Shared/Infrastructure/Interceptor/TransformBodyImageFileInterceptor';

@Controller('landing')
export class StoreConversationController {
  constructor(
    private readonly storeConversationUseCase: StoreConversationUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Guest()
  @Post('chat/:chatId/message')
  @UseInterceptors(
    SubscriptionGuardInterceptor,
    new TransformBodyImageFileInterceptor(MessagesDto),
  )
  async __invoke(
    @Req() req: Request,
    @GetAuth() authDto: AuthDto,
    @Param() chatIdDto: ChatIdDto,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _body: any,
  ) {
    const messagesDto = req.body as unknown as MessagesDto;

    (messagesDto as any).file = (req as any).file ?? null;

    const response = await this.storeConversationUseCase.__invoke(
      authDto,
      chatIdDto,
      messagesDto,
    );

    return successResponse(this.i18n, 'message.created', response);
  }
}
