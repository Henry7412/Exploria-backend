import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatBotService } from '@/Application/Landing/ChatBot/Infrastructure/Services/ChatBot.service';
import { ChatBotRepository } from '@/Application/Landing/ChatBot/Infrastructure/Repositories/ChatBot.respository';
import { StoreChatBotController } from '@/Application/Landing/ChatBot/Infrastructure/Controllers/StoreChatBot.controller';
import { UserModule } from '@/Application/Common/User/User.module';
import { CreditsSchema } from '@/Shared/Domain/Schemas/Credits.schema';
import { SubscriptionsSchema } from '@/Shared/Domain/Schemas/Subscriptions.schema';
import { UserSchema } from '@/Shared/Domain/Schemas/User.schema';
import { ChatSchema } from '@/Shared/Domain/Schemas/Chat.schema';
import { StoreChatBotUseCase } from '@/Application/Landing/ChatBot/Application/Post/StoreChatBot.useCase';
import { MessageSchema } from '@/Shared/Domain/Schemas/Message.schema';
import { ChatMemorySyncController } from '@/Application/Landing/ChatBot/Infrastructure/Controllers/ChatMemorySync.controller';
import { ChatMemorySyncUseCase } from '@/Application/Landing/ChatBot/Application/Put/ChatBotMemorySync.useCase';
import { NewChatBotUseCase } from '@/Application/Landing/ChatBot/Application/Post/NewChatBot.useCase';
import { NewChatBotController } from '@/Application/Landing/ChatBot/Infrastructure/Controllers/NewChatBot.controller';
import { StoreConversationUseCase } from '@/Application/Landing/ChatBot/Application/Post/StoreConversation.useCase';
import { PerspectiveService } from '@/Shared/Infrastructure/Interceptor/GeminiInterceptor/PerspectiveService';
import { StoreConversationController } from '@/Application/Landing/ChatBot/Infrastructure/Controllers/StoreConversation.controller';
import { GeminiModule } from '@/Shared/Infrastructure/Common/Gemini/Gemini.module';
import { CreditsModule } from '@/Application/Landing/Credits/Credits.module';
import { PromptHistorySchema } from '@/Shared/Domain/Schemas/PromptHistory.schema';
import { ChatDetailController } from '@/Application/Landing/ChatBot/Infrastructure/Controllers/ChatDetail.controller';
import { ChatDetailUseCase } from '@/Application/Landing/ChatBot/Application/Get/ChatDetail.useCase';
import { GeminiRecommendationUseCase } from '@/Application/Landing/ChatBot/Application/Post/GeminiRecommendation.useCase';
import { GeminiRecommendationController } from '@/Application/Landing/ChatBot/Infrastructure/Controllers/GeminiRecommendation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Chat', schema: ChatSchema },
      { name: 'Messages', schema: MessageSchema },
      { name: 'Users', schema: UserSchema },
      { name: 'PromptHistory', schema: PromptHistorySchema },
      { name: 'User', schema: UserSchema },
      { name: 'Subscriptions', schema: SubscriptionsSchema },
      { name: 'Credits', schema: CreditsSchema },
    ]),
    // BullModule.registerQueue({ name: 'FileMessageJob' }),
    GeminiModule,
    CreditsModule,
    UserModule,
  ],
  controllers: [
    StoreConversationController,
    ChatDetailController,
    StoreChatBotController,
    GeminiRecommendationController,
    NewChatBotController,
    ChatMemorySyncController,
    // ChatHistoryController,
    // FileMessageController,
    // PlannerController,
    // AudioMessageController,
  ],
  providers: [
    ChatBotService,
    ChatBotRepository,
    StoreConversationUseCase,
    ChatDetailUseCase,
    StoreChatBotUseCase,
    GeminiRecommendationUseCase,
    NewChatBotUseCase,
    PerspectiveService,
    ChatMemorySyncUseCase,
    // ChatHistoryUseCase,
    // FileMessageUseCase,
    // PlannerUseCase,
    // AudioMessageUseCase,
  ],
  exports: [ChatBotService, ChatBotRepository],
})
export class ChatBotModule {}
