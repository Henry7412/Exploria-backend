import { Injectable } from '@nestjs/common';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { ChatbotImageUploadInterface } from '@/Application/Landing/ChatBot/Infrastructure/Interfaces/ChatbotImageUpload.interface';
import { ChatBotService } from '@/Application/Landing/ChatBot/Infrastructure/Services/ChatBot.service';
import { ChatIdDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatId.dto';

@Injectable()
export class ChatbotImageUseCase {
  constructor(private readonly chatbotService: ChatBotService) {}

  async __invoke(
    authDto: AuthDto,
    chatId: ChatIdDto,
    chatbotImageUploadInterface: ChatbotImageUploadInterface,
  ): Promise<any> {
    return await this.chatbotService.uploadChatbotImage(
      authDto,
      chatId,
      chatbotImageUploadInterface,
    );
  }
}
