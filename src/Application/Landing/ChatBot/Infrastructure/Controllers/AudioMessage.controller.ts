import { AudioMessageUseCase } from '@/Application/Landing/ChatBot/Application/Post/AudioMessage.useCase';
import { I18nService } from 'nestjs-i18n';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { TransformBodyFileInterceptor } from '@/Shared/Infrastructure/Interceptor/TransformBodyFile.interceptor';
import { AudioDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/Audio.dto';
import { AudioInterface } from '@/Application/Landing/ChatBot/Job/Interface/Audio.interface';

@Controller('landing')
export class AudioMessageController {
  constructor(
    private readonly audioMessageUseCase: AudioMessageUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Post('message/audio')
  @UseInterceptors(new TransformBodyFileInterceptor(AudioDto))
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Body() audioInterface: AudioInterface,
  ): Promise<any> {
    const response = await this.audioMessageUseCase.__invoke(
      authDto,
      audioInterface,
    );

    return successResponse(this.i18n, 'message.created', response);
  }
}
