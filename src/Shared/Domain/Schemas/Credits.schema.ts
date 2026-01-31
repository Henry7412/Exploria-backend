import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { CoinTypesEnum } from '@/Shared/Infrastructure/Common/Enum/CoinTypes.enum';
import { CreditProvideEnum } from '@/Shared/Infrastructure/Common/Enum/CreditProvide.enum';
import { CreditStatusEnum } from '@/Shared/Infrastructure/Common/Enum/CreditStatus.enum';
import { PaymentStatusEnum } from '@/Shared/Infrastructure/Common/Enum/PaymentStatus.enum';

export type Credits = HydratedDocument<CreditsDocument>;

@Schema({ collection: 'credits' })
export class CreditsDocument {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: false })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subscriptions', required: false })
  subscriptionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Packages', required: false })
  packageId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String, enum: CreditProvideEnum, required: true })
  provide: CreditProvideEnum;

  @Prop({ type: String, enum: CreditStatusEnum, required: true })
  status: CreditStatusEnum;

  @Prop({
    type: [
      {
        status: { type: String, enum: CreditStatusEnum },
        provide: { type: String, enum: CreditProvideEnum },
        quantity: { type: Number },
        createdAt: { type: Date },
        createdBy: {
          names: { type: String },
          lastNames: { type: String },
          picture: { type: String },
          userId: { type: Types.ObjectId },
        },
      },
    ],
    default: [],
  })
  logs: {
    status: CreditStatusEnum;
    provide: CreditProvideEnum;
    quantity: number;
    createdAt: Date;
    createdBy: {
      names: string;
      lastNames: string;
      picture: string;
      userId?: Types.ObjectId;
    };
  }[];

  @Prop({ type: Number, required: false, default: 0 })
  amount: number;

  @Prop({ type: String })
  file: string;

  @Prop({
    type: String,
    enum: PaymentStatusEnum,
    required: false,
    default: null,
  })
  payment: PaymentStatusEnum;

  @Prop({ type: String, enum: CoinTypesEnum, default: CoinTypesEnum.PEN })
  coin: CoinTypesEnum;

  @Prop({ type: String, required: false })
  orderCode?: string;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({
    type: {
      names: { type: String, required: true },
      lastNames: { type: String, required: true },
      picture: { type: String },
    },
    _id: false,
  })
  createdBy: {
    names: string;
    lastNames: string;
    picture: string;
  };

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CreditsSchema = SchemaFactory.createForClass(CreditsDocument);
