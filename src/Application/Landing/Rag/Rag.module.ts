import { Module } from '@nestjs/common';
import { RedisVectorClient } from '@/Application/Landing/Rag/Infrastructure/Client/RedisVector.client';
import { RagEmbeddingService } from '@/Application/Landing/Rag/Infrastructure/Services/RagEmbedding.service';
import { RagIngestUseCase } from '@/Application/Landing/Rag/Application/RagUseCase/RagIngest.useCase';
import { RagQueryUseCase } from '@/Application/Landing/Rag/Application/RagUseCase/RagQuery.useCase';
import { RagIngestController } from '@/Application/Landing/Rag/Infrastructure/Controllers/RagIngest.controller';
import { GeminiModule } from '@/Shared/Infrastructure/Common/Gemini/Gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [RagIngestController],
  providers: [
    RedisVectorClient,
    RagEmbeddingService,
    RagIngestUseCase,
    RagQueryUseCase,
  ],
  exports: [RagIngestUseCase, RagQueryUseCase],
})
export class RagModule {}
