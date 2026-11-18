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

    const probabilityMap: Record<string, number> = {
      NEGLIGIBLE: 0.1,
      LOW: 0.3,
      MEDIUM: 0.6,
      HIGH: 0.9,
    };

    let toxicityScore = 0;

    for (const rating of safety) {
      if (
        rating.category === HarmCategory.HARM_CATEGORY_HARASSMENT ||
        rating.category === HarmCategory.HARM_CATEGORY_HATE_SPEECH
      ) {
        const numericScore =
          typeof rating.probability === 'number'
            ? rating.probability
            : (probabilityMap[String(rating.probability)] ?? 0);
        toxicityScore = Math.max(toxicityScore, numericScore);
      }
    }

    return toxicityScore;
  }
}
