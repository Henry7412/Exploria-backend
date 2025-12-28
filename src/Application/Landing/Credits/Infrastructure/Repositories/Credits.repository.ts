import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreditsDocument } from '@/Shared/Domain/Schemas/Credits.schema';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { CreditProvideEnum } from '@/Shared/Infrastructure/Common/Enum/CreditProvide.enum';
import { CreditStatusEnum } from '@/Shared/Infrastructure/Common/Enum/CreditsStatus.enum';

@Injectable()
export class CreditsRepository {
  constructor(
    @InjectModel('Credits')
    private readonly creditsModel: Model<CreditsDocument>,
  ) {}

  async consumeCreditDynamic(
    authDto: AuthDto,
    quantity: number = 1,
  ): Promise<CreditsDocument | null> {
    const filter: any = {
      active: true,
      quantity: { $gte: quantity },
    };

    if (authDto._id) {
      filter.userId = new Types.ObjectId(authDto._id);
    } else {
      return null;
    }

    const creditDoc = await this.creditsModel.findOne(filter);
    if (!creditDoc) return null;

    const logEntry = {
      status: CreditStatusEnum.CONSUMED,
      provide: CreditProvideEnum.CONSUME,
      quantity: -quantity,
      createdAt: new Date(),
      createdBy: {
        names: authDto.names ?? '',
        lastNames: authDto.lastNames ?? '',
        picture: authDto.picturePath ?? '',
        userId: authDto._id ? new Types.ObjectId(authDto._id) : null,
      },
    };

    return this.creditsModel.findOneAndUpdate(
      { _id: creditDoc._id },
      {
        $inc: { quantity: -quantity },
        $set: {
          status: CreditStatusEnum.CONSUMED,
          provide: CreditProvideEnum.CONSUME,
        },
        $push: { logs: logEntry },
      },
      { new: true },
    );
  }

  async updateOne(
    filter: object,
    update: object,
  ): Promise<CreditsDocument | null> {
    return await this.creditsModel
      .findOneAndUpdate(filter, update, { new: true })
      .exec();
  }

  async generateOrderCode(): Promise<string> {
    const lastCredits = await this.creditsModel.findOne(
      { orderCode: { $exists: true } },
      {},
      { sort: { _id: -1 } },
    );

    let lastCode = 0;
    if (lastCredits && lastCredits.orderCode) {
      lastCode = parseInt(lastCredits.orderCode, 10) || 0;
    }

    return (lastCode + 1).toString().padStart(6, '0');
  }
}
