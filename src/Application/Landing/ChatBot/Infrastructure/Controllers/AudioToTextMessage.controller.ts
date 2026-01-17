import { Body, Controller, Post, StreamableFile } from '@nestjs/common';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { TextToSpeechDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/TexttoSpeech.dto';
import { AudioToTextMessageUseCase } from '@/Application/Landing/ChatBot/Application/Post/AudioToTextMessage.useCase';

@Controller('landing')
export class AudioToTextMessageController {
  constructor(
    private readonly audioToTextMessageUseCase: AudioToTextMessageUseCase,
  ) {}

  @Post('message/tts')
  async __invoke(@GetAuth() authDto: AuthDto, @Body() dto: TextToSpeechDto) {
    const { audioBuffer, mimeType } =
      await this.audioToTextMessageUseCase.__invoke(authDto, dto);

    return new StreamableFile(audioBuffer, {
      type: mimeType,
      disposition: `inline`,
    });
  }
}
