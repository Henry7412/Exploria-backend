import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CoinTypesEnum } from '@/Shared/Infrastructure/Common/Enum/CoinTypes.enum';

export type Packages = HydratedDocument<PackagesDocument>;

@Schema({ collection: 'packages' })
export class PackagesDocument {
  @Prop({ type: String, default: null })
  name: string;

  @Prop({ type: Boolean, default: true, index: true })
  active: boolean;

  @Prop({ type: Number, required: false, default: 0 })
  amount: number;

  @Prop({ type: Number, required: false, default: 0 })
  credits: number;

  @Prop({ type: String, enum: CoinTypesEnum, default: CoinTypesEnum.PEN })
  coin: CoinTypesEnum;

  @Prop({ type: Boolean, default: false, index: true })
  disable: boolean;

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

  @Prop({
    type: {
      names: { type: String, required: true },
      lastNames: { type: String, required: true },
      picture: { type: String },
    },
    _id: false,
  })
  deletedBy: {
    names: string;
    lastNames: string;
    picture: string;
  };

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const PackagesSchema = SchemaFactory.createForClass(PackagesDocument);
