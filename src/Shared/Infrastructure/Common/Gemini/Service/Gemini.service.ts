import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  ChatGeminiCompletionUtils,
  GeminiPart,
} from '@/Shared/Infrastructure/Common/Gemini/Utils/ChatGeminiCompletion.utils';
import { GeminiRecommendationsPrompts } from '@/Shared/Infrastructure/Common/Gemini/Promps/GeminiRecommendations.prompts';

type HistoryMsgLegacy = {
  role: 'user' | 'model' | 'system';
  content: string;
};

type HistoryMsgParts = {
  role: 'user' | 'model' | 'system';
  parts: GeminiPart[];
};

type HistoryMsg = HistoryMsgLegacy | HistoryMsgParts;

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
    messages: HistoryMsg[],
    systemPrompt?: string,
  ): Promise<any> {
    const contents: Array<{ role: string; parts: GeminiPart[] }> = [];

    for (const msg of messages) {
      const role = msg.role === 'system' ? 'model' : msg.role;

      const parts: GeminiPart[] =
        'parts' in msg ? msg.parts : [{ text: (msg.content ?? '').toString() }];

      contents.push({ role, parts });
    }

    return await this.geminiUtils.geminiChatCompletion(contents, systemPrompt);
  }
}
