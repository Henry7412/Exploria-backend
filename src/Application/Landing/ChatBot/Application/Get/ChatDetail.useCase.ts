import { Injectable } from '@nestjs/common';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { ChatIdDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatId.dto';
import { ChatPaginationDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatPagination.dto';
import { ChatBotService } from '@/Application/Landing/ChatBot/Infrastructure/Services/ChatBot.service';

@Injectable()
export class ChatDetailUseCase {
  constructor(private readonly chatBotService: ChatBotService) {}

  async __invoke(
    authDto: AuthDto,
    chatIdDto: ChatIdDto,
    chatPaginationDto: ChatPaginationDto,
  ): Promise<any> {
    return await this.chatBotService.detailChat(
      authDto,
      chatIdDto,
      chatPaginationDto,
    );
  }
}
