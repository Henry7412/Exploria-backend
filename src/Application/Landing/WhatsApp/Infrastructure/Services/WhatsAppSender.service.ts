import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WhatsAppSenderService {
  constructor(private readonly http: HttpService) {}

  private apiVersion = process.env.WHATSAPP_API_VERSION || 'v24.0';

  private toDigitsE164(to: string): string {
    return String(to ?? '').replace(/\D/g, '');
  }

  async sendText(to: string, text: string) {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_TOKEN;

    if (!phoneNumberId) {
      throw new InternalServerErrorException(
        'WHATSAPP_PHONE_NUMBER_ID missing',
      );
    }
    if (!token) {
      throw new InternalServerErrorException('WHATSAPP_TOKEN missing');
    }

    const toSanitized = this.toDigitsE164(to);
    if (!toSanitized) {
      throw new InternalServerErrorException('Invalid "to" phone number');
    }

    const url = `https://graph.facebook.com/${this.apiVersion}/${phoneNumberId}/messages`;

    try {
      await firstValueFrom(
        this.http.post(
          url,
          {
            messaging_product: 'whatsapp',
            to: toSanitized,
            type: 'text',
            text: { body: text },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
    } catch (e: any) {
      const metaErr = e?.response?.data ?? e?.message;
      console.error('WhatsApp send error:', metaErr);
      throw e;
    }
  }

  async sendTagsList(
    to: string,
    buttonTitle: string,
    bodyText: string,
    tags: string[],
  ) {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_TOKEN;

    if (!phoneNumberId)
      throw new InternalServerErrorException(
        'WHATSAPP_PHONE_NUMBER_ID missing',
      );
    if (!token)
      throw new InternalServerErrorException('WHATSAPP_TOKEN missing');

    const toSanitized = this.toDigitsE164(to);
    if (!toSanitized)
      throw new InternalServerErrorException('Invalid "to" phone number');

    const url = `https://graph.facebook.com/${this.apiVersion}/${phoneNumberId}/messages`;

    const rows = tags.slice(0, 10).map((t) => ({
      id: `tag:${t}`,
      title: t,
      description: `Seleccionar ${t}`,
    }));

    try {
      await firstValueFrom(
        this.http.post(
          url,
          {
            messaging_product: 'whatsapp',
            to: toSanitized,
            type: 'interactive',
            interactive: {
              type: 'list',
              body: { text: bodyText },
              action: {
                button: buttonTitle,
                sections: [{ title: 'Tags', rows }],
              },
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
    } catch (e: any) {
      const metaErr = e?.response?.data ?? e?.message;
      console.error('WhatsApp send error:', metaErr);
      throw e;
    }
  }

  async sendActionsList(
    to: string,
    title: string,
    bodyText: string,
    actions: string[],
  ) {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_TOKEN;

    if (!phoneNumberId)
      throw new InternalServerErrorException(
        'WHATSAPP_PHONE_NUMBER_ID missing',
      );
    if (!token)
      throw new InternalServerErrorException('WHATSAPP_TOKEN missing');

    const toSanitized = this.toDigitsE164(to);
    if (!toSanitized)
      throw new InternalServerErrorException('Invalid "to" phone number');

    const url = `https://graph.facebook.com/${this.apiVersion}/${phoneNumberId}/messages`;

    const rows = actions.slice(0, 10).map((code) => ({
      id: `action:${code}`,
      title: code,
      description: 'Ver recomendaciones',
    }));

    await firstValueFrom(
      this.http.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: toSanitized,
          type: 'interactive',
          interactive: {
            type: 'list',
            body: { text: bodyText },
            action: {
              button: title,
              sections: [{ title: 'Opciones', rows }],
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );
  }

  async sendLongText(to: string, text: string) {
    const chunks = splitWhatsApp(text, 900);
    for (const part of chunks) {
      await this.sendText(to, part);
    }
  }
}
function splitWhatsApp(text: string, max = 900): string[] {
  const clean = String(text ?? '').trim();
  if (!clean) return ['Listo 🙂'];

  // cortar por párrafos primero
  const paragraphs = clean
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const out: string[] = [];
  let buf = '';

  for (const p of paragraphs) {
    const candidate = buf ? `${buf}\n\n${p}` : p;

    if (candidate.length <= max) {
      buf = candidate;
      continue;
    }

    if (buf) out.push(buf);
    buf = '';

    // si un párrafo excede, lo cortamos en pedazos
    if (p.length > max) {
      for (let i = 0; i < p.length; i += max) {
        out.push(p.slice(i, i + max));
      }
    } else {
      buf = p;
    }
  }

  if (buf) out.push(buf);
  return out;
}
