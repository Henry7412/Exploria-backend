import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { CoinTypesEnum } from '@/Shared/Infrastructure/Common/Enum/CoinTypes.enum';
import { PaymentStatusEnum } from '@/Shared/Infrastructure/Common/Enum/PaymentStatus.enum';
import { SubscriptionStatusEnum } from '@/Shared/Infrastructure/Common/Enum/SubscriptionStatus.enum';

export type Subscriptions = HydratedDocument<SubscriptionsDocument>;

@Schema({ collection: 'subscriptions' })
export class SubscriptionsDocument {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: false })
  userId?: Types.ObjectId;

  @Prop({ type: String, enum: SubscriptionStatusEnum, required: true })
  status: SubscriptionStatusEnum;

  @Prop({ type: Types.ObjectId, ref: 'Plans', required: false })
  plan: Types.ObjectId;

  @Prop({
    type: String,
    enum: PaymentStatusEnum,
    required: false,
    default: null,
  })
  payment: PaymentStatusEnum;

  @Prop({ type: String, enum: CoinTypesEnum, default: CoinTypesEnum.PEN })
  coin: CoinTypesEnum;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: false, default: null })
  endDate: Date | null;

  @Prop({ type: Number, required: false, default: 0 })
  amount: number;

  @Prop({ type: String })
  file: string;

  @Prop({ type: String, required: false, unique: true, index: true })
  orderCode: string;

  @Prop({ type: Boolean, default: false })
  annual: boolean;

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

  @Prop({
    type: {
      names: { type: String, required: true },
      lastNames: { type: String, required: true },
      picture: { type: String },
    },
    _id: false,
  })
  updatedBy: {
    names: string;
    lastNames: string;
    picture: string;
  };

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  updatedAt: Date;
}

export const SubscriptionsSchema = SchemaFactory.createForClass(
  SubscriptionsDocument,
);
