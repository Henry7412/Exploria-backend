import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BillingPeriodEnum } from '@/Shared/Infrastructure/Common/Enum/BillingPeriod.enum';
import { ClientEnum } from '@/Shared/Infrastructure/Common/Enum/Client.enum';
import { CoinTypesEnum } from '@/Shared/Infrastructure/Common/Enum/CoinTypes.enum';
import { PlanSubscriptionEnum } from '@/Shared/Infrastructure/Common/Enum/PlanSubscription.enum';

export type Plans = HydratedDocument<PlansDocument>;

@Schema({ collection: 'plans' })
export class PlansDocument {
  @Prop({ type: String, enum: PlanSubscriptionEnum, required: true })
  name: PlanSubscriptionEnum;

  @Prop({ type: Boolean, default: true, index: true })
  active: boolean;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, enum: ClientEnum, required: true })
  client: ClientEnum;

  @Prop({ type: String, enum: BillingPeriodEnum, required: true })
  period: BillingPeriodEnum;

  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: Boolean, required: true, default: false })
  annual: boolean;

  @Prop({ type: String, enum: CoinTypesEnum, default: CoinTypesEnum.PEN })
  coin: CoinTypesEnum;

  @Prop({ type: Number, required: false, default: 0 })
  discount: number;

  @Prop({ type: Number, required: false, default: 0 })
  credits: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const PlanSchema = SchemaFactory.createForClass(PlansDocument);
