import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreditsDocument } from '@/Shared/Domain/Schemas/Credits.schema';
import { PackagesDocument } from '@/Shared/Domain/Schemas/Packages.schema';
import { SubscriptionsDocument } from '@/Shared/Domain/Schemas/Subscriptions.schema';
import { UserDocument } from '@/Shared/Domain/Schemas/User.schema';
import { CoinTypesEnum } from '@/Shared/Infrastructure/Common/Enum/CoinTypes.enum';
import { CreditProvideEnum } from '@/Shared/Infrastructure/Common/Enum/CreditProvide.enum';

@Injectable()
export class BackOfficeCreditsRepository {
  constructor(
    @InjectModel('Credits')
    private readonly backOfficeCreditsModel: Model<CreditsDocument>,
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
    @InjectModel('Subscriptions')
    private readonly subscriptionModel: Model<SubscriptionsDocument>,
    @InjectModel('Packages')
    private readonly packagesModel: Model<PackagesDocument>,
  ) {}

  async create(data: Partial<CreditsDocument>): Promise<CreditsDocument> {
    return this.backOfficeCreditsModel.create(data);
  }

  async getCreditsStats(): Promise<any> {
    const creditsSold = await this.backOfficeCreditsModel.aggregate([
      { $unwind: '$logs' },
      { $match: { 'logs.status': 'CREDITED', payment: 'PAID' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$logs.quantity' },
          coin: { $first: '$coin' },
        },
      },
    ]);

    const creditsInUse = await this.backOfficeCreditsModel.aggregate([
      { $unwind: '$logs' },
      { $match: { 'logs.status': 'CONSUMED', payment: 'PAID' } },
      {
        $group: {
          _id: null,
          total: { $sum: { $abs: '$logs.quantity' } },
          coin: { $first: '$coin' },
        },
      },
    ]);

    const totalTransactions = await this.backOfficeCreditsModel.countDocuments({
      payment: 'PAID',
    });

    const creditsSoldTotal = creditsSold[0]?.total || 0;
    const creditsInUseTotal = creditsInUse[0]?.total || 0;
    const totalCredits = Math.max(creditsSoldTotal - creditsInUseTotal, 0);

    return {
      creditsSold: creditsSoldTotal,
      creditsInUse: creditsInUseTotal,
      totalTransactions,
      totalCredits,
      coin: creditsSold[0]?.coin || CoinTypesEnum.PEN,
    };
  }

  async listPaginatedBusinessSubscriptions(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.subscriptionModel.aggregate([
        {
          $match: {
            orderCode: { $exists: true, $ne: null },
            businessId: { $exists: true, $ne: null },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        { $skip: skip },
        { $limit: pageSize },
        {
          $lookup: {
            from: 'businesses',
            localField: 'businessId',
            foreignField: '_id',
            as: 'business',
          },
        },
        {
          $unwind: { path: '$business', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'plans',
            localField: 'plan',
            foreignField: '_id',
            as: 'plan',
          },
        },
        {
          $unwind: { path: '$plan', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'business.users',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $project: {
            _id: 1,
            payment: 1,
            createdAt: 1,
            orderCode: 1,
            'business._id': 1,
            'business.name': 1,
            'business.path': 1,
            'business.status': 1,
            'business.archived': 1,
            'plan.name': 1,
            users: {
              $map: {
                input: '$users',
                as: 'user',
                in: {
                  _id: '$$user._id',
                  names: '$$user.names',
                  lastNames: '$$user.lastNames',
                  picture: '$$user.picture',
                },
              },
            },
          },
        },
      ]),
      this.subscriptionModel.countDocuments({
        orderCode: { $exists: true, $ne: null },
        businessId: { $exists: true, $ne: null },
      }),
    ]);

    const formattedData = data.map((item) => ({
      subscription: {
        _id: item._id,
        payment: item.payment,
        createdAt: item.createdAt,
        orderCode: item.orderCode,
      },
      business: {
        _id: item.business?._id,
        name: item.business?.name,
        path: item.business?.path,
      },
      accounts: {
        status: item.business?.status,
        archived: item.business?.archived,
        plan: item.plan?.name || null,
        users: item.users || [],
      },
    }));

    return {
      data: formattedData,
      total,
    };
  }

  async updateSubscription(subscriptionId: Types.ObjectId, attributes: object) {
    return await this.subscriptionModel
      .findOneAndUpdate({ _id: subscriptionId }, attributes, { new: true })
      .exec();
  }

  async updateCredit(creditId: Types.ObjectId, attributes: object) {
    return await this.backOfficeCreditsModel
      .findOneAndUpdate({ _id: creditId }, attributes, {
        new: true,
      })
      .exec();
  }

  async getAllCreditsWithOrderCode(
    page: number,
    pageSize: number,
  ): Promise<any[]> {
    const skip = (page - 1) * pageSize;

    return this.backOfficeCreditsModel.aggregate([
      {
        $match: {
          active: true,
          orderCode: { $exists: true, $ne: null },
        },
      },

      {
        $addFields: {
          latestSaleLogDate: {
            $max: {
              $map: {
                input: {
                  $filter: {
                    input: '$logs',
                    as: 'log',
                    cond: { $eq: ['$$log.provide', 'SALE'] },
                  },
                },
                as: 'log',
                in: '$$log.createdAt',
              },
            },
          },
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },

      {
        $lookup: {
          from: 'packages',
          localField: 'packageId',
          foreignField: '_id',
          as: 'package',
        },
      },
      { $unwind: { path: '$package', preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          user: {
            _id: '$user._id',
            names: '$user.names',
            lastNames: '$user.lastNames',
          },
          credit: {
            creditId: '$_id',
            quantity: '$quantity',
            createdAt: '$createdAt',
            updatedAt: {
              $cond: [
                { $eq: ['$payment', 'PAID'] },
                '$latestSaleLogDate',
                null,
              ],
            },
            payment: '$payment',
            orderCode: '$orderCode',
          },
          package: {
            name: '$package.name',
          },
        },
      },

      { $sort: { 'credit.createdAt': -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ]);
  }

  async countAllCreditsWithOrderCode(): Promise<number> {
    return this.backOfficeCreditsModel.countDocuments({
      active: true,
      orderCode: { $exists: true, $ne: null },
    });
  }

  async getLatestSaleLog(userId: string): Promise<any> {
    const log = await this.backOfficeCreditsModel
      .findOne({ userId, 'logs.provide': 'SALE' })
      .sort({ 'logs.createdAt': -1 });

    const latestLog = log?.logs?.find((log: any) => log.provide === 'SALE');
    return latestLog
      ? {
          quantity: latestLog.quantity,
          updatedAt: latestLog.createdAt,
        }
      : null;
  }

  async getPackagesStats(): Promise<any> {
    const credits = await this.backOfficeCreditsModel
      .find({ active: true })
      .lean();

    const packagesActive = await this.packagesModel.countDocuments({
      active: true,
      disable: false,
      deletedAt: null,
    });

    let packagesSold = 0;
    let creditsSold = 0;
    let totalAmount = 0;

    const coins: CoinTypesEnum[] = [];

    for (const credit of credits) {
      totalAmount += credit.amount ?? 0;

      if (credit.packageId) {
        const pkg = await this.packagesModel.findById(credit.packageId).lean();
        if (pkg && pkg['coin']) {
          coins.push(pkg['coin']);
        }
      }

      credit.logs?.forEach((log) => {
        if (log.provide === CreditProvideEnum.SALE) {
          packagesSold++;
          creditsSold += log.quantity ?? 0;
        }
      });
    }

    const uniqueCoins = [...new Set(coins)];
    const coin: CoinTypesEnum =
      uniqueCoins.length > 0 ? uniqueCoins[0] : CoinTypesEnum.PEN;

    return {
      packagesActive,
      packagesSold,
      creditsSold,
      totalAmount,
      coin,
    };
  }

  async findDetailById(id: Types.ObjectId): Promise<any> {
    return this.backOfficeCreditsModel
      .findOne({ _id: id })
      .select(
        ' _id quantity provide status coin amount file payment userId packageId',
      )
      .populate('userId', '_id names lastNames')
      .populate('packageId', '_id name')
      .lean();
  }
}
