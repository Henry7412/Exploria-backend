import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Types } from 'mongoose';

import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { SubscriptionGuardInterceptor } from '@/Shared/Infrastructure/Interceptor/GeminiInterceptor/SubscriptionGuardInterceptor';

import { ChatMetricsRepository } from '@/Application/Landing/ChatBot/Infrastructure/Repositories/ChatMetrics.repository';

type Channel = 'web' | 'whatsapp';

function parseDateOrThrow(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new BadRequestException(`Invalid date: ${value}`);
  }
  return d;
}

function parseChannelOrThrow(value?: string): Channel | undefined {
  if (!value) return undefined;
  if (value !== 'web' && value !== 'whatsapp') {
    throw new BadRequestException(`Invalid channel: ${value}`);
  }
  return value;
}

function parseObjectIdOrThrow(value?: string): Types.ObjectId | undefined {
  if (!value) return undefined;
  if (!Types.ObjectId.isValid(value)) {
    throw new BadRequestException(`Invalid ObjectId: ${value}`);
  }
  return new Types.ObjectId(value);
}

@Controller('landing/chat/metrics')
export class MetricsController {
  constructor(
    private readonly i18n: I18nService,
    private readonly chatMetricsRepository: ChatMetricsRepository,
  ) {}

  @UseInterceptors(SubscriptionGuardInterceptor)
  @Get('summary')
  async summary(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('channel') channel?: string,
  ) {
    const fromDate = parseDateOrThrow(from);
    const toDate = parseDateOrThrow(to);
    const ch = parseChannelOrThrow(channel);

    const result = await this.chatMetricsRepository.summary({
      from: fromDate,
      to: toDate,
      channel: ch,
    });

    return successResponse(this.i18n, 'message.retrieved', result);
  }

  @UseInterceptors(SubscriptionGuardInterceptor)
  @Get('list')
  async list(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('channel') channel?: string,
    @Query('chatId') chatId?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
  ) {
    const fromDate = parseDateOrThrow(from);
    const toDate = parseDateOrThrow(to);
    const ch = parseChannelOrThrow(channel);

    const chatObjectId = parseObjectIdOrThrow(chatId);

    let userObjectId: Types.ObjectId | null | undefined = undefined;
    if (typeof userId !== 'undefined') {
      if (userId === 'null') userObjectId = null;
      else userObjectId = parseObjectIdOrThrow(userId) ?? undefined;
    }

    const limitNum = Math.min(Math.max(Number(limit ?? 200), 1), 1000);
    if (Number.isNaN(limitNum)) {
      throw new BadRequestException(`Invalid limit: ${limit}`);
    }

    const items = await this.chatMetricsRepository.list({
      from: fromDate,
      to: toDate,
      channel: ch,
      chatId: chatObjectId,
      userId: userObjectId,
      limit: limitNum,
    });

    return successResponse(this.i18n, 'message.retrieved', { items });
  }
}
