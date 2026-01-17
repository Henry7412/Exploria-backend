import { Injectable } from '@nestjs/common';
import { ChatBotService } from '@/Application/Landing/ChatBot/Infrastructure/Services/ChatBot.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { AudioInterface } from '@/Application/Landing/ChatBot/Job/Interface/Audio.interface';

@Injectable()
export class AudioMessageUseCase {
  constructor(private readonly chatBotService: ChatBotService) {}

  async __invoke(
    authDto: AuthDto,
    audioInterface: AudioInterface,
  ): Promise<any> {
    return await this.chatBotService.messageAudio(authDto, audioInterface);
  }
}
