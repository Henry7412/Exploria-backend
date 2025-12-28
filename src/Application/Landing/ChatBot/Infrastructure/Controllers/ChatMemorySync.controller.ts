import { Body, Controller, Put } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { Guest } from '@/Shared/Infrastructure/Decorator/Guest.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { ChatMemoryDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatMemory.dto';
import { ChatMemorySyncUseCase } from '@/Application/Landing/ChatBot/Application/Put/ChatBotMemorySync.useCase';

@Controller('landing')
export class ChatMemorySyncController {
  constructor(
    private readonly chatMemorySyncUseCase: ChatMemorySyncUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Guest()
  @Put('chat/memory-sync')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Body() chatMemoryDto: ChatMemoryDto,
  ): Promise<any> {
    const response = await this.chatMemorySyncUseCase.__invoke(
      authDto,
      chatMemoryDto,
    );
    return successResponse(this.i18n, 'message.updated', response);
  }
}
