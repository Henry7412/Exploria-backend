import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatMetricDocument } from '@/Shared/Domain/Schemas/ChatMetrics.schema';

export type CreateChatMetricPayload = {
  chatId: Types.ObjectId;
  userId?: Types.ObjectId | null;
  deviceId?: string;
  channel: 'web' | 'whatsapp';
  requestAt: Date;
  responseAt: Date;
  responseTimeMs: number;
  resolved: boolean;
  hasImage: boolean;
  toxicity?: number | null;
  model?: string | null;
  errorCode?: string | null;
};

@Injectable()
export class ChatMetricsRepository {
  constructor(
    @InjectModel('ChatMetric')
    private readonly chatMetricModel: Model<ChatMetricDocument>,
  ) {}

  async create(payload: CreateChatMetricPayload): Promise<ChatMetricDocument> {
    return this.chatMetricModel.create(payload);
  }

  async list(params: {
    from?: Date;
    to?: Date;
    chatId?: Types.ObjectId;
    userId?: Types.ObjectId | null;
    channel?: 'web' | 'whatsapp';
    limit?: number;
  }): Promise<ChatMetricDocument[]> {
    const filter: any = {};

    if (params.from || params.to) {
      filter.createdAt = {};
      if (params.from) filter.createdAt.$gte = params.from;
      if (params.to) filter.createdAt.$lte = params.to;
    }

    if (params.chatId) filter.chatId = params.chatId;
    if (typeof params.userId !== 'undefined') filter.userId = params.userId;
    if (params.channel) filter.channel = params.channel;

    const limit = Math.min(Math.max(params.limit ?? 200, 1), 1000);

    return this.chatMetricModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async summary(params: {
    from?: Date;
    to?: Date;
    channel?: 'web' | 'whatsapp';
  }) {
    const match: any = {};

    if (params.from || params.to) {
      match.createdAt = {};
      if (params.from) match.createdAt.$gte = params.from;
      if (params.to) match.createdAt.$lte = params.to;
    }

    if (params.channel) match.channel = params.channel;

    const agg = await this.chatMetricModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          avgResponseTimeMs: { $avg: '$responseTimeMs' },
          resolvedCount: {
            $sum: { $cond: ['$resolved', 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          avgResponseTimeMs: { $round: ['$avgResponseTimeMs', 0] },
          resolvedCount: 1,
          fcrPercent: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [{ $divide: ['$resolvedCount', '$count'] }, 100],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },
    ]);

    return (
      agg?.[0] ?? {
        count: 0,
        avgResponseTimeMs: 0,
        resolvedCount: 0,
        fcrPercent: 0,
      }
    );
  }
}
