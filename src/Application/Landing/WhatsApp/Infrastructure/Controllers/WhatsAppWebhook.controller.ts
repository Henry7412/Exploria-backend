import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { Types } from 'mongoose';

import { WhatsAppSenderService } from '../Services/WhatsAppSender.service';
import { ChatBotService } from '@/Application/Landing/ChatBot/Infrastructure/Services/ChatBot.service';

@Controller('landing/webhooks/whatsapp')
export class WhatsAppWebhookController {
  constructor(
    private readonly whatsappSender: WhatsAppSenderService,
    private readonly chatBotService: ChatBotService,
  ) {}

  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() reply: FastifyReply,
  ) {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? '';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return reply
        .code(200)
        .header('content-type', 'text/plain')
        .send(challenge ?? '');
    }

    return reply.code(403).send('Invalid verify token');
  }

  @Post()
  @HttpCode(200)
  async onEvent(@Body() body: any) {
    try {
      const change = body?.entry?.[0]?.changes?.[0];
      const value = change?.value;

      const message = value?.messages?.[0];
      if (!message) return { ok: true };

      const from: string | undefined = message?.from;
      if (!from) return { ok: true };

      const allowedTo = (process.env.WHATSAPP_ALLOWED_TO ?? '').replace(
        /\D/g,
        '',
      );
      if (allowedTo && from !== allowedTo) return { ok: true };

      const deviceId = `wa_${from}`;

      const chatResp = await this.chatBotService.createChat(null, { deviceId });
      const chatId = chatResp?.chat?._id;
      if (!chatId) {
        await this.whatsappSender.sendText(
          from,
          'No pude iniciar el chat. Intenta de nuevo.',
        );
        return { ok: true };
      }

      const interactiveId = this.extractInteractiveId(message);
      if (interactiveId?.startsWith('action:')) {
        const actionCode = interactiveId.replace('action:', '').trim();

        const rec = await this.chatBotService.generateRecommendations(
          null as any,
          {
            chatId: new Types.ObjectId(String(chatId)),
            deviceId,
            action: actionCode,
          } as any,
        );

        const replyText = this.extractReplyText(rec);

        await this.whatsappSender.sendText(from, replyText);

        const actions = this.extractActions(rec);
        if (actions.length) {
          await this.whatsappSender.sendActionsList(
            from,
            'Ver más opciones',
            'Elige una opción:',
            actions,
          );
        }

        return { ok: true };
      }

      const safeText = (this.extractAnyText(message) ?? '').trim();
      if (!safeText) {
        await this.whatsappSender.sendText(
          from,
          'Escríbeme un mensaje para ayudarte 🙂',
        );
        return { ok: true };
      }

      const bot = await this.chatBotService.chatBotConversation(
        null as any,
        { chatId: new Types.ObjectId(String(chatId)) } as any,
        { deviceId, value: safeText } as any,
      );

      const replyText = this.extractReplyText(bot);
      await this.whatsappSender.sendLongText(from, replyText);

      const actions = this.extractActions(bot);
      if (actions.length) {
        await this.whatsappSender.sendActionsList(
          from,
          'Ver opciones',
          '¿Qué te gustaría hacer ahora?',
          actions,
        );
      }

      return { ok: true };
    } catch (e: any) {
      console.error(
        'WhatsApp webhook error:',
        e?.response?.data ?? e?.message ?? e,
      );
      return { ok: true };
    }
  }

  private extractInteractiveId(message: any): string | null {
    if (message?.type !== 'interactive') return null;
    return message?.interactive?.list_reply?.id ?? null;
  }

  private extractAnyText(message: any): string {
    const type = message?.type;

    if (type === 'text') return message?.text?.body ?? '';
    if (type === 'button') return message?.button?.text ?? '';

    if (type === 'interactive') {
      const i = message?.interactive;
      return i?.list_reply?.title ?? i?.button_reply?.title ?? '';
    }

    if (type === 'image') return message?.image?.caption ?? '';
    if (type === 'document') return message?.document?.caption ?? '';
    if (type === 'video') return message?.video?.caption ?? '';

    return '';
  }

  private extractReplyText(payload: any): string {
    if (payload && typeof payload === 'object') {
      if (typeof payload.value === 'string') return payload.value;

      if (payload.value && typeof payload.value === 'object') {
        const inner = payload.value;
        if (typeof inner.value === 'string') return inner.value;
        if (typeof inner.text === 'string') return inner.text;
      }

      if (payload.data) return this.extractReplyText(payload.data);
      if (payload.items?.[0]) return this.extractReplyText(payload.items[0]);
    }

    if (typeof payload === 'string') return payload;

    return 'Listo 🙂';
  }

  private extractActions(payload: any): string[] {
    const actions =
      payload && typeof payload === 'object' && Array.isArray(payload.actions)
        ? payload.actions.filter((x: any) => typeof x === 'string')
        : [];

    return actions.slice(0, 10);
  }
}
