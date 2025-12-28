import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { ProfessionalViewEnum } from '@/Shared/Infrastructure/Common/Enum/ProfessionalView.enum';
import { VoiceToneEnum } from '@/Shared/Infrastructure/Common/Enum/VoiceTone.enum';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ collection: 'chats' })
export class Chat {
  @Prop({ type: String, default: null })
  funFact: string;

  @Prop({ type: String, default: null })
  jobTitle: string;

  @Prop({ type: String, default: null })
  favoriteFoods: string;

  @Prop({ type: String, default: null })
  medicalConsiderations: string;

  @Prop({ type: [String], enum: VoiceToneEnum, default: [] })
  voiceTones: VoiceToneEnum[];

  @Prop({ type: [String], enum: ProfessionalViewEnum, default: [] })
  perspectives: ProfessionalViewEnum[];

  @Prop({ type: String, default: null })
  name: string;

  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: Boolean, default: false })
  user: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  updatedAt: Date;

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

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: Boolean, default: true })
  current: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
