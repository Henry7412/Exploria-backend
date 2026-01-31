import { Module } from '@nestjs/common';
import { WhatsAppWebhookController } from './Infrastructure/Controllers/WhatsAppWebhook.controller';
import { HttpModule } from '@nestjs/axios';
import { WhatsAppSenderService } from '@/Application/Landing/WhatsApp/Infrastructure/Services/WhatsAppSender.service';
import { ChatBotModule } from '@/Application/Landing/ChatBot/ChatBot.module';

@Module({
  imports: [HttpModule, ChatBotModule],
  controllers: [WhatsAppWebhookController],
  providers: [WhatsAppSenderService],
  exports: [WhatsAppSenderService],
})
export class WhatsAppModule {}
