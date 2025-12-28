import { Injectable } from '@nestjs/common';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { StoreChatDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/StoreChatBot.dto';
import { ChatBotService } from '@/Application/Landing/ChatBot/Infrastructure/Services/ChatBot.service';

@Injectable()
export class StoreChatBotUseCase {
  constructor(private readonly chatBotService: ChatBotService) {}

  async __invoke(authDto: AuthDto, storeChatDto: StoreChatDto): Promise<any> {
    return await this.chatBotService.createChat(authDto, storeChatDto);
  }
}
