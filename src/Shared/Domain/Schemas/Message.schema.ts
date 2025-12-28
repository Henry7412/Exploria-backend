import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { ChatModelsEnum } from '@/Shared/Infrastructure/Common/Enum/ChatModels.enum';

export type Message = HydratedDocument<MessageDocument>;

@Schema({ collection: 'messages' })
export class MessageDocument {
  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chatId: Types.ObjectId;

  @Prop({ type: String, enum: ['user', 'model', 'system'], required: true })
  role: 'user' | 'model' | 'system';

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  value: string;

  @Prop({ type: Number, required: false, default: null })
  toxicity?: number;

  @Prop({ type: String })
  deviceId?: string;

  @Prop({ type: String, enum: ChatModelsEnum, required: false, default: null })
  model?: ChatModelsEnum;

  @Prop({
    type: {
      _id: { type: Types.ObjectId, required: false },
      names: { type: String, required: false },
      lastNames: { type: String, required: false },
      picture: { type: String },
    },
  })
  createdBy: {
    _id: Types.ObjectId;
    names: string;
    lastNames: string;
    picture: string;
  };

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument);
