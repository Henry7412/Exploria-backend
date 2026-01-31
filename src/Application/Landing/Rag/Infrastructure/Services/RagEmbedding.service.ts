import { ChatGeminiCompletionUtils } from '@/Shared/Infrastructure/Common/Gemini/Utils/ChatGeminiCompletion.utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RagEmbeddingService {
  constructor(private readonly geminiUtils: ChatGeminiCompletionUtils) {}

  async embed(text: string): Promise<number[]> {
    const model: any = this.geminiUtils.rawClient.getGenerativeModel({
      model: 'text-embedding-004',
    });

    const res = await model.embedContent(text);
    return res.embedding.values;
  }

  toBuffer(vec: number[]): Buffer {
    return Buffer.from(new Float32Array(vec).buffer);
  }
}
