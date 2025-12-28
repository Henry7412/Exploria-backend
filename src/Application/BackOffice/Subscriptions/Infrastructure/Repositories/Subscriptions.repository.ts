import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { SubscriptionsDocument } from '@/Shared/Domain/Schemas/Subscriptions.schema';
import { SubscriptionStatusEnum } from '@/Shared/Infrastructure/Common/Enum/SubscriptionStatus.enum';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectModel('Subscriptions')
    private readonly subscriptionModel: Model<SubscriptionsDocument>,
  ) {}

  async findExpired(now: Date) {
    return this.subscriptionModel
      .find({
        state: 'WEEKLY',
        status: 'ACTIVE',
        endDate: { $lt: now },
      })
      .exec();
  }

  async update(subscriptionId: Types.ObjectId, attributes: object) {
    return await this.subscriptionModel
      .findOneAndUpdate({ _id: subscriptionId }, attributes, { new: true })
      .exec();
  }

  async getSubscriptionDetailWithUser(subscriptionId: Types.ObjectId) {
    const pipeline = [
      { $match: { _id: subscriptionId } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          'user._id': 1,
          'user.names': 1,
          'user.lastNames': 1,
          _id: 1,
          state: 1,
          status: 1,
          startDate: 1,
          endDate: 1,
        },
      },
    ];
    const [result] = await this.subscriptionModel.aggregate(pipeline).exec();
    return result;
  }

  async findActiveByUser(
    userId: Types.ObjectId,
  ): Promise<SubscriptionsDocument | null> {
    return this.subscriptionModel.findOne({ userId, status: 'ACTIVE' });
  }

  async findById(id: Types.ObjectId) {
    return this.subscriptionModel.findById(id).exec();
  }

  async create(subscription: Partial<SubscriptionsDocument>) {
    return this.subscriptionModel.create(subscription);
  }

  async findExpiringSubscriptions(): Promise<SubscriptionsDocument[]> {
    const now = new Date();

    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + 3);
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    return this.subscriptionModel.find({
      endDate: {
        $gte: targetDate,
        $lt: nextDay,
      },
      status: SubscriptionStatusEnum.ACTIVE,
    });
  }
}
