import { Controller, Get, Param, Query } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { Guest } from '@/Shared/Infrastructure/Decorator/Guest.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { ChatDetailUseCase } from '@/Application/Landing/ChatBot/Application/Get/ChatDetail.useCase';
import { ChatIdDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatId.dto';
import { ChatPaginationDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatPagination.dto';

@Controller('landing/chat')
export class ChatDetailController {
  constructor(
    private readonly chatDetailUseCase: ChatDetailUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Guest()
  @Get(':chatId/messages')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Param() chatIdDto: ChatIdDto,
    @Query() chatPaginationDto: ChatPaginationDto,
  ): Promise<any> {
    const response = await this.chatDetailUseCase.__invoke(
      authDto,
      chatIdDto,
      chatPaginationDto,
    );

    return successResponse(this.i18n, null, response);
  }
}
