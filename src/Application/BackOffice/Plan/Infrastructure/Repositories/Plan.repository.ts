import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Plans } from '@/Shared/Domain/Schemas/Plan.schema';
import { SubscriptionsDocument } from '@/Shared/Domain/Schemas/Subscriptions.schema';
import { UserDocument } from '@/Shared/Domain/Schemas/User.schema';
import { CoinTypesEnum } from '@/Shared/Infrastructure/Common/Enum/CoinTypes.enum';
import { BaseRepository } from '@/Shared/Infrastructure/Repositories/Base.repository';

export class PlanRepository extends BaseRepository<Plans> {
  constructor(
    @InjectModel('Plans')
    private readonly plansModel: Model<Plans>,
    @InjectModel('Subscriptions')
    private readonly subscriptionModel: Model<SubscriptionsDocument>,
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {
    super(plansModel);
  }

  async getPlanList(): Promise<any> {
    return await this.plansModel
      .aggregate([
        {
          $match: {
            active: true,
          },
        },
        {
          $project: {
            name: 1,
          },
        },
      ])
      .exec();
  }

  async updatePlan(subscriptionId: Types.ObjectId, attributes: object) {
    return await this.subscriptionModel
      .findOneAndUpdate({ _id: subscriptionId }, attributes, { new: true })
      .exec();
  }

  async findActivePlans(): Promise<any[]> {
    return this.plansModel
      .find({ active: true })
      .select('-active -createdAt -__v -updatedAt -deletedAt -features')
      .lean();
  }

  async listPaginatedUsersPlan(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const baseMatch = { userId: { $exists: true, $ne: null } };

    const [rows, total] = await Promise.all([
      this.subscriptionModel.aggregate([
        { $match: baseMatch },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: pageSize },

        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },

        {
          $lookup: {
            from: 'plans',
            localField: 'plan',
            foreignField: '_id',
            as: 'plan',
          },
        },
        { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },

        {
          $project: {
            _id: 0,
            user: {
              _id: '$user._id',
              names: '$user.names',
              lastNames: '$user.lastNames',
              picture: '$user.picture',
            },
            plan: '$plan.name',
            subscription: {
              status: '$status',
              startDate: '$startDate',
              endDate: '$endDate',
              amount: '$amount',
              orderCode: '$orderCode',
              payment: '$payment',
            },
          },
        },
      ]),

      this.subscriptionModel.countDocuments(baseMatch),
    ]);

    return {
      data: rows,
      total,
    };
  }

  async getTotalUsers(): Promise<number> {
    return this.userModel.countDocuments();
  }

  async getActiveUsers(): Promise<number> {
    return this.userModel.countDocuments({ active: true });
  }

  async getPlansData(): Promise<{
    totalSold: number;
    totalAmount: number;
    coin: string;
  }> {
    const result = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'plans',
          localField: 'plan',
          foreignField: '_id',
          as: 'planInfo',
        },
      },
      { $unwind: '$planInfo' },

      { $match: { 'planInfo.amount': { $gt: 0 } } },

      {
        $group: {
          _id: null,
          totalSold: { $sum: 1 },
          totalAmount: { $sum: '$planInfo.amount' },
          coin: { $first: '$planInfo.coin' },
        },
      },
    ]);

    return (
      result[0] ?? { totalSold: 0, totalAmount: 0, coin: CoinTypesEnum.PEN }
    );
  }

  async generateOrderCode(): Promise<string> {
    const lastSubscriptions = await this.subscriptionModel.findOne(
      { orderCode: { $exists: true } },
      {},
      { sort: { _id: -1 } },
    );

    let lastCode = 0;
    if (lastSubscriptions && lastSubscriptions.orderCode) {
      lastCode = parseInt(lastSubscriptions.orderCode, 10) || 0;
    }

    return (lastCode + 1).toString().padStart(6, '0');
  }

  async getLimitedPlans(): Promise<Types.ObjectId[]> {
    const plans = await this.plansModel
      .find({ name: { $in: ['PLAN_FREE', 'PLAN_ENTREPRENEUR'] } })
      .select('_id')
      .lean();

    return plans.map((p) => new Types.ObjectId(p._id));
  }
}
