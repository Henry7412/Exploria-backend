import { Injectable } from '@nestjs/common';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { ChatBotService } from '@/Application/Landing/ChatBot/Infrastructure/Services/ChatBot.service';
import { RecommendationDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/Recommendation.dto';

@Injectable()
export class GeminiRecommendationUseCase {
  constructor(private readonly chatBotService: ChatBotService) {}

  async __invoke(
    authDto: AuthDto,
    recommendationDto: RecommendationDto,
  ): Promise<any> {
    return await this.chatBotService.generateRecommendations(
      authDto,
      recommendationDto,
    );
  }
}
