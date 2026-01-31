import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ActionTypeEnum } from '@/Shared/Infrastructure/Common/Enum/ActionType.enum';

export type PromptHistory = HydratedDocument<PromptHistoryDocument>;

@Schema({ collection: 'promptHistory' })
export class PromptHistoryDocument {
  @Prop({ type: String, required: true, enum: ActionTypeEnum })
  name: ActionTypeEnum;

  @Prop({ type: String, required: true })
  promptIntro: string;

  @Prop({ type: String, required: true })
  dataFocus: string;

  @Prop({ type: [String], required: true })
  extraInstructions: string[];

  @Prop({ type: String, required: true })
  shortIntro: string;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const PromptHistorySchema = SchemaFactory.createForClass(
  PromptHistoryDocument,
);
