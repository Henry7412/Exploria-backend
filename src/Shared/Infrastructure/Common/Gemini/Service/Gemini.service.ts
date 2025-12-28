import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ChatGeminiCompletionUtils } from '@/Shared/Infrastructure/Common/Gemini/Utils/ChatGeminiCompletion.utils';
import { GeminiRecommendationsPrompts } from '@/Shared/Infrastructure/Common/Gemini/Promps/GeminiRecommendations.prompts';

@Injectable()
export class GeminiService {
  constructor(
    private readonly geminiUtils: ChatGeminiCompletionUtils,
    private readonly geminiRecommendationsPrompts: GeminiRecommendationsPrompts,
    private readonly i18n: I18nService,
  ) {}

  async recommendTravelHighlights(
    contextText: string,
    userProfile: any,
    preferredLang: string,
    promptConfig: any,
    alternativesConfig: any[] = [],
    logged: boolean = false,
  ) {
    const { system, user } =
      this.geminiRecommendationsPrompts.generateRecommendationPrompt(
        contextText,
        userProfile,
        preferredLang,
        this.i18n,
        promptConfig,
        alternativesConfig,
        logged,
      );

    return await this.geminiUtils.geminiClassicPrompt(system, user);
  }

  async chatWithHistory(
    messages: { role: 'user' | 'model' | 'system'; content: string }[],
    systemPrompt?: string,
  ): Promise<any> {
    const contents: any[] = [];

    if (systemPrompt) {
      contents.push({
        role: 'model',
        parts: [{ text: systemPrompt.trim() }],
      });
    }

    for (const msg of messages) {
      const role = msg.role === 'system' ? 'model' : msg.role;
      contents.push({
        role,
        parts: [{ text: msg.content }],
      });
    }

    return await this.geminiUtils.geminiChatCompletion(contents);
  }
}
