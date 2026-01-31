import { Injectable } from '@nestjs/common';
import { RagEmbeddingService } from '@/Application/Landing/Rag/Infrastructure/Services/RagEmbedding.service';
import { RedisVectorClient } from '@/Application/Landing/Rag/Infrastructure/Client/RedisVector.client';

@Injectable()
export class RagQueryUseCase {
  constructor(
    private readonly embedding: RagEmbeddingService,
    private readonly redisVector: RedisVectorClient,
  ) {}

  async search(query: string, k = 3): Promise<string[]> {
    const embedding = await this.embedding.embed(query);
    const buffer = this.embedding.toBuffer(embedding);

    const knn = `*=>[KNN ${k} @embedding $vec AS score]`;

    const res: any = await this.redisVector.redis.call(
      'FT.SEARCH',
      'idx:rag',
      knn,
      'PARAMS',
      '2',
      'vec',
      buffer,
      'SORTBY',
      'score',
      'ASC',
      'RETURN',
      '1',
      'content',
      'DIALECT',
      '2',
    );

    if (!res || res.length < 2) return [];
    return res.slice(2).map((r: any) => r[1][1]);
  }
}
