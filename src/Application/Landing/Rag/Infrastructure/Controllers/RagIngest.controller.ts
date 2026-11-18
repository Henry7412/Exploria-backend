import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RagIngestUseCase } from '@/Application/Landing/Rag/Application/RagUseCase/RagIngest.useCase';
import { JwtAuthGuard } from '@/Shared/Infrastructure/Jwt/Guards/JwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('landing/rag')
export class RagIngestController {
  constructor(private readonly ingest: RagIngestUseCase) {}

  @Post('upsert')
  async upsert(@Body() body: { id: string; text: string }) {
    await this.ingest.upsert(body.id, body.text);
    return { ok: true };
  }
}
