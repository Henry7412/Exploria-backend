import { Injectable } from '@nestjs/common';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { ChatBotService } from '@/Application/Landing/ChatBot/Infrastructure/Services/ChatBot.service';
import { ChatIdDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatId.dto';
import { MessagesDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/Message.dto';

@Injectable()
export class StoreConversationUseCase {
  constructor(private readonly chatBotService: ChatBotService) {}

  async __invoke(
    authDto: AuthDto,
    chatIdDto: ChatIdDto,
    messageDto: MessagesDto,
  ): Promise<any> {
    return await this.chatBotService.chatBotConversation(
      authDto,
      chatIdDto,
      messageDto,
    );
  }
}
