import { Injectable } from '@nestjs/common';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { ChatMemoryDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatMemory.dto';
import { ChatBotService } from '@/Application/Landing/ChatBot/Infrastructure/Services/ChatBot.service';

@Injectable()
export class ChatMemorySyncUseCase {
  constructor(private readonly chatBotService: ChatBotService) {}

  async __invoke(authDto: AuthDto, chatMemoryDto: ChatMemoryDto): Promise<any> {
    return await this.chatBotService.chatMemory(authDto, chatMemoryDto);
  }
}
