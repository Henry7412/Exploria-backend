import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ChatModelsEnum } from '@/Shared/Infrastructure/Common/Enum/ChatModels.enum';

export type ChatMetric = HydratedDocument<ChatMetricDocument>;

@Schema({ collection: 'chat_metrics' })
export class ChatMetricDocument {
  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chatId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false, default: null })
  userId?: Types.ObjectId | null;

  @Prop({ type: String, required: false, default: '' })
  deviceId?: string;

  // web | whatsapp (lo detectamos por deviceId wa_)
  @Prop({ type: String, enum: ['web', 'whatsapp'], required: true })
  channel: 'web' | 'whatsapp';

  @Prop({ type: Date, required: true })
  requestAt: Date;

  @Prop({ type: Date, required: true })
  responseAt: Date;

  @Prop({ type: Number, required: true })
  responseTimeMs: number;

  // ✅ FCR base: se considera resuelto si el bot respondió correctamente
  @Prop({ type: Boolean, required: true })
  resolved: boolean;

  @Prop({ type: Boolean, required: true, default: false })
  hasImage: boolean;

  @Prop({ type: Number, required: false, default: null })
  toxicity?: number | null;

  @Prop({ type: String, enum: ChatModelsEnum, required: false, default: null })
  model?: ChatModelsEnum | null;

  // opcional: útil para depurar errores sin romper análisis
  @Prop({ type: String, required: false, default: null })
  errorCode?: string | null;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ChatMetricSchema =
  SchemaFactory.createForClass(ChatMetricDocument);

// Índices recomendados (rápidos para queries por fechas y chat)
ChatMetricSchema.index({ chatId: 1, createdAt: -1 });
ChatMetricSchema.index({ channel: 1, createdAt: -1 });
ChatMetricSchema.index({ userId: 1, createdAt: -1 });
