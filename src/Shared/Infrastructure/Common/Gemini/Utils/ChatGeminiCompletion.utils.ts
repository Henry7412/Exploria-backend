import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Logger } from '@/Shared/Infrastructure/Logger/Logger';

export type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export function messageToText(value: any): string {
  if (value == null) return '';

  if (typeof value === 'string') return value;

  if (typeof value === 'object') {
    if (typeof value.value === 'string') return value.value;

    if (typeof value.text === 'string') return value.text;

    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }

  return String(value);
}

export function toGeminiMsgFromDb(
  msg: any,
): { role: 'user' | 'model'; parts: GeminiPart[] } | null {
  const role: 'user' | 'model' = msg.role === 'user' ? 'user' : 'model';

  const text = messageToText(msg.value).trim();
  if (!text) return null;

  return {
    role,
    parts: [{ text }],
  };
}

@Injectable()
export class ChatGeminiCompletionUtils {
  private readonly client: GoogleGenerativeAI;

  constructor(private readonly i18n: I18nService) {
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async geminiChatCompletion(
    contents: Array<{ role: string; parts: GeminiPart[] }>,
    systemPrompt?: string,
  ): Promise<any> {
    let geminiResponseText: string | null = null;

    const cleanGeminiJson = (str: string) => {
      if (!str) return '';
      str = str.replace(/```json|```/g, '').trim();
      if (str.startsWith('"') && str.endsWith('"')) {
        str = str.slice(1, -1).replace(/\\"/g, '"');
      }
      return str.trim();
    };

    try {
      const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

      const model = this.client.getGenerativeModel({
        model: modelName,
        ...(systemPrompt ? { systemInstruction: systemPrompt.trim() } : {}),
      });

      const result = await model.generateContent({ contents });

      geminiResponseText =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const cleaned = cleanGeminiJson(geminiResponseText);

      try {
        let parsed = JSON.parse(cleaned);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        return parsed;
      } catch {
        return cleaned;
      }
    } catch (error: any) {
      new Logger().errorMessage('Error con Gemini Completion API', {
        message: error?.message,
      });

      return this.i18n.t('message.error_when_returning_ai_result');
    }
  }

  async geminiClassicPrompt(system: string, user: string): Promise<any> {
    const contents = [
      { role: 'user', parts: [{ text: system.trim() }] },
      { role: 'user', parts: [{ text: user.trim() }] },
    ];
    return this.geminiChatCompletion(contents);
  }

  get rawClient() {
    return this.client;
  }
}
