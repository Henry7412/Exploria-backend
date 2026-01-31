import { Body, Controller, Post } from '@nestjs/common';
import { RagIngestUseCase } from '@/Application/Landing/Rag/Application/RagUseCase/RagIngest.useCase';

@Controller('landing/rag')
export class RagIngestController {
  constructor(private readonly ingest: RagIngestUseCase) {}

  @Post('upsert')
  async upsert(@Body() body: { id: string; text: string }) {
    await this.ingest.upsert(body.id, body.text);
    return { ok: true };
  }
}
