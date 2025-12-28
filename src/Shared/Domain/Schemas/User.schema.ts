import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { InterestEnum } from '@/Shared/Infrastructure/Common/Enum/Interest.enum';
import { LanguagesEnum } from '@/Shared/Infrastructure/Common/Enum/Languages.enum';
import { ProfessionalViewEnum } from '@/Shared/Infrastructure/Common/Enum/ProfessionalView.enum';
import { VoiceToneEnum } from '@/Shared/Infrastructure/Common/Enum/VoiceTone.enum';
import { PlanSubscriptionEnum } from '@/Shared/Infrastructure/Common/Enum/PlanSubscription.enum';

export type User = HydratedDocument<UserDocument>;

@Schema({ collection: 'users' })
export class UserDocument {
  @Prop({ type: String, required: true, default: null })
  names: string;

  @Prop({ type: String, required: true, default: null })
  lastNames: string;

  @Prop({ type: String, default: '+51' })
  zipCode: string;

  @Prop({
    type: String,
    required: false,
    index: true,
    unique: false,
    default: null,
  })
  phoneNumber: string;

  @Prop({
    type: String,
    required: false,
    index: true,
    unique: false,
    default: null,
  })
  email: string;

  @Prop({ type: String, default: null })
  password: string;

  @Prop({ type: String, default: null })
  picture: string;

  @Prop({ type: Number, default: null })
  passwordRecoveryAttempts: number;

  @Prop({ type: Date, default: null })
  passwordRecoveryLockoutDate: Date;

  @Prop({ type: String, default: null })
  dateOfBirth: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Nationalities',
    index: true,
    default: null,
  })
  nationality: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Plans',
    index: true,
    default: PlanSubscriptionEnum.PLAN_FREE,
  })
  plan: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subscriptions', default: null })
  subscriptionId: Types.ObjectId;

  @Prop({
    type: Array<string>,
    enum: InterestEnum,
    default: [],
  })
  interest: string[];

  @Prop({ type: String, default: null })
  jobTitle: string;

  @Prop({ type: String, default: null })
  hobbies: string;

  @Prop({
    type: Array<string>,
    enum: LanguagesEnum,
    default: [],
  })
  languages: string[];

  @Prop({ type: String, default: null })
  aboutMe: string;

  @Prop({ type: String, default: null })
  funFact: string;

  @Prop({ type: String, default: null })
  favoriteFoods: string;

  @Prop({ type: String, default: null })
  medicalConsiderations: string;

  @Prop({ type: [String], enum: VoiceToneEnum, default: [] })
  voiceTones: VoiceToneEnum[];

  @Prop({ type: [String], enum: ProfessionalViewEnum, default: [] })
  perspectives: ProfessionalViewEnum[];

  @Prop({ type: Boolean, default: true, index: true })
  active: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
