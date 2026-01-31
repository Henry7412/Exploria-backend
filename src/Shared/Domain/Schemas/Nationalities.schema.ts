import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Nationalities = HydratedDocument<NationalitiesDocument>;

@Schema({ collection: 'nationalities' })
export class NationalitiesDocument {
  @Prop({ type: String, default: null })
  name: string;

  @Prop({ type: String, default: null })
  code: string;

  @Prop({ type: String, default: null })
  callingCodes: string;

  @Prop({ type: Object, default: null })
  coordinates: object;

  @Prop({ type: String, default: null })
  flag: string;

  @Prop({ type: Boolean, default: true, index: true })
  active: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const NationalitySchema = SchemaFactory.createForClass(
  NationalitiesDocument,
);
