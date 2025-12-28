import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { GeminiRecommendationUseCase } from '@/Application/Landing/ChatBot/Application/Post/GeminiRecommendation.useCase';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { Guest } from '@/Shared/Infrastructure/Decorator/Guest.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { SubscriptionGuardInterceptor } from '@/Shared/Infrastructure/Interceptor/GeminiInterceptor/SubscriptionGuardInterceptor';
import { RecommendationDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/Recommendation.dto';

@Controller('landing/chat')
export class GeminiRecommendationController {
  constructor(
    private readonly i18n: I18nService,
    private readonly geminiRecommendationUseCase: GeminiRecommendationUseCase,
  ) {}

  @UseInterceptors(SubscriptionGuardInterceptor)
  @Guest()
  @Post('recommendation')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Body() recommendationDto: RecommendationDto,
  ): Promise<any> {
    const response = await this.geminiRecommendationUseCase.__invoke(
      authDto,
      recommendationDto,
    );
    const wrappedResponse = { items: [response] };

    return successResponse(this.i18n, 'message.updated', wrappedResponse);
  }
}
