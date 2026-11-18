import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { RagEmbeddingService } from '@/Application/Landing/Rag/Infrastructure/Services/RagEmbedding.service';
import { RedisVectorClient } from '@/Application/Landing/Rag/Infrastructure/Client/RedisVector.client';

@Injectable()
export class RagIngestUseCase {
  constructor(
    private readonly embedding: RagEmbeddingService,
    private readonly redisVector: RedisVectorClient,
  ) {}

  async upsert(id: string, text: string): Promise<void> {
    if (!this.redisVector.isVectorEnabled) {
      throw new ServiceUnavailableException(
        'RAG vector index is not available (RediSearch module required)',
      );
    }

    const embedding = await this.embedding.embed(text);
    const buffer = this.embedding.toBuffer(embedding);

    await this.redisVector.redis.hset(`rag:${id}`, {
      content: text,
      embedding: buffer,
    });
  }
}
