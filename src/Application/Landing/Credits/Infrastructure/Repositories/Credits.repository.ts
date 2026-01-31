import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreditsDocument } from '@/Shared/Domain/Schemas/Credits.schema';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { CreditProvideEnum } from '@/Shared/Infrastructure/Common/Enum/CreditProvide.enum';
import { CreditStatusEnum } from '@/Shared/Infrastructure/Common/Enum/CreditStatus.enum';

@Injectable()
export class CreditsRepository {
  constructor(
    @InjectModel('Credits')
    private readonly creditsModel: Model<CreditsDocument>,
  ) {}

  async consumeCreditDynamic(
    authDto: AuthDto,
    quantity: number = 1,
  ): Promise<CreditsDocument> {
    if (!authDto._id) {
      throw new BadRequestException('User id is required to consume credits');
    }

    const filter: any = {
      active: true,
      quantity: { $gte: quantity },
      userId: new Types.ObjectId(authDto._id),
    };

    const creditDoc = await this.creditsModel.findOne(filter);
    if (!creditDoc) {
      throw new BadRequestException('Insufficient credits');
    }

    const logEntry = {
      status: CreditStatusEnum.CONSUMED,
      provide: CreditProvideEnum.CONSUME,
      quantity: -quantity,
      createdAt: new Date(),
      createdBy: {
        names: authDto.names ?? '',
        lastNames: authDto.lastNames ?? '',
        picture: authDto.picturePath ?? '',
        userId: new Types.ObjectId(authDto._id),
      },
    };

    const updated = await this.creditsModel.findOneAndUpdate(
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

    if (!updated) {
      throw new BadRequestException('Failed to consume credits');
    }

    return updated;
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
