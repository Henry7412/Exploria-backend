import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { NotificationTypesEnum } from '@/Shared/Infrastructure/Common/Enum/NotificationTypes.enum';

export type Notifications = HydratedDocument<NotificationsDocument>;

@Schema({ collection: 'notifications' })
export class NotificationsDocument {
  @Prop({ type: String, enum: NotificationTypesEnum, required: true })
  type: NotificationTypesEnum;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  user?: Types.ObjectId | null;

  @Prop({
    type: {
      message: { type: String, default: null },
    },
    default: {},
    _id: false,
  })
  data?: {
    message?: string;
  };

  @Prop({ type: Boolean, default: false })
  read: boolean;

  @Prop({ type: Boolean, default: true })
  visible: boolean;

  @Prop({ type: Date, default: null })
  readAt?: Date;

  @Prop({ type: Object, required: false })
  createdBy?: { names: string; lastNames: string; picture: string };

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const NotificationsSchema = SchemaFactory.createForClass(
  NotificationsDocument,
);
