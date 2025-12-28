import { Module } from '@nestjs/common';

import { ChatGeminiCompletionUtils } from '@/Shared/Infrastructure/Common/Gemini/Utils/ChatGeminiCompletion.utils';
import { GeminiService } from '@/Shared/Infrastructure/Common/Gemini/Service/Gemini.service';
import { GeminiRecommendationsPrompts } from '@/Shared/Infrastructure/Common/Gemini/Promps/GeminiRecommendations.prompts';

@Module({
  providers: [
    ChatGeminiCompletionUtils,
    GeminiService,
    GeminiRecommendationsPrompts,
  ],
  exports: [GeminiService, GeminiRecommendationsPrompts],
})
export class GeminiModule {}
