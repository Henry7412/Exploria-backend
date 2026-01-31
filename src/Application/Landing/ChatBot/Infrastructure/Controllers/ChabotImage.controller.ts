import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { TransformBodyImageFileInterceptor } from '@/Shared/Infrastructure/Interceptor/TransformBodyImageFileInterceptor';
import { ChatbotImageUploadInterface } from '@/Application/Landing/ChatBot/Infrastructure/Interfaces/ChatbotImageUpload.interface';
import { ChatbotImageUploadDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatbotImageUpload.dto';
import { ChatbotImageUseCase } from '@/Application/Landing/ChatBot/Application/Post/ChabotImage.useCase';
import { ChatIdDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatId.dto';

@Controller('landing/chatbot')
export class ChatbotImageController {
  constructor(
    private readonly chatbotImageUseCase: ChatbotImageUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Post('image/:chatId')
  @UseInterceptors(new TransformBodyImageFileInterceptor(ChatbotImageUploadDto))
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Param() chatId: ChatIdDto,
    @Body() chatbotImageUploadInterface: ChatbotImageUploadInterface,
  ) {
    const response = await this.chatbotImageUseCase.__invoke(
      authDto,
      chatId,
      chatbotImageUploadInterface,
    );
    return successResponse(this.i18n, 'message.created', response);
  }
}
