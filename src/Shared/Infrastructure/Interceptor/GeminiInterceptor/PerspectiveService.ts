import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PerspectiveService {
  private readonly model;

  constructor() {
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    this.model = client.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
  }

  async analyzeToxicity(text: string): Promise<number> {
    const result = await this.model.generateContent(text);

    const safety = result.response?.promptFeedback?.safetyRatings ?? [];

    let toxicityScore = 0;

    for (const rating of safety) {
      if (
        rating.category === HarmCategory.HARM_CATEGORY_HARASSMENT ||
        rating.category === HarmCategory.HARM_CATEGORY_HATE_SPEECH
      ) {
        toxicityScore = Math.max(toxicityScore, rating.probability || 0);
      }
    }

    return toxicityScore;
  }
}
