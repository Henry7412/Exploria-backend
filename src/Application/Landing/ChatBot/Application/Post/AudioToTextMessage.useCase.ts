import { Injectable } from '@nestjs/common';
import { ChatBotService } from '@/Application/Landing/ChatBot/Infrastructure/Services/ChatBot.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { TextToSpeechDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/TexttoSpeech.dto';

@Injectable()
export class AudioToTextMessageUseCase {
  constructor(private readonly chatBotService: ChatBotService) {}

  async __invoke(authDto: AuthDto, dto: TextToSpeechDto) {
    return this.chatBotService.messageTts(authDto, dto);
  }
}
