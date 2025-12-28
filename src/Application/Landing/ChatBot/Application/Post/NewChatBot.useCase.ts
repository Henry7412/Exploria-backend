import { Injectable } from '@nestjs/common';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { ChatBotService } from '@/Application/Landing/ChatBot/Infrastructure/Services/ChatBot.service';
import { StoreChatDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/StoreChatBot.dto';

@Injectable()
export class NewChatBotUseCase {
  constructor(private readonly chatBotService: ChatBotService) {}

  async __invoke(authDto: AuthDto, storeChatDto: StoreChatDto): Promise<any> {
    return await this.chatBotService.createNewChat(authDto, storeChatDto);
  }
}
