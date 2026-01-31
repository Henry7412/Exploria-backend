import { Types } from 'mongoose';
import {
  getGoogleSpeechClient,
  getGoogleTtsClient,
} from '@/Shared/Infrastructure/Utils/Speech';

export type ChatPreferences = {
  _id: Types.ObjectId;
  medicalConsiderations: string;
  favoriteFoods: string;
  jobTitle: string;
  funFact: string;
  perspectives: string[];
  voiceTones: string[];
  user: boolean;
};

// export function buildPlannerValue(dto: PlannerDto): string {
//   const people = dto.people ?? 1;
//   const days = dto.days ?? 1;
//   const price = dto.price ?? 0;
//   const coin = dto.coin ?? 'PEN';
//
//   const transportList = Array.isArray(dto.transport)
//     ? dto.transport.join(', ')
//     : (dto.transport ?? '—');
//
//   let message = `Estoy planeando una escapada para **${people}** ${
//     people > 1 ? 'personas' : 'persona'
//   }, por **${days} ${days > 1 ? 'días' : 'día'}** con un presupuesto de **${price} ${coin}**.\n`;
//
//   if (dto.transport) {
//     message += `Nos gustaría viajar en **${transportList}**.\n`;
//   }
//
//   if (dto.value && dto.value.trim().length > 0) {
//     message += `También considera lo siguiente:\n${dto.value}`;
//   }
//
//   message += `¿Podrías recomendarnos algo ideal?`;
//
//   return message;
// }
//
type UploadedFile = {
  mimetype: string;
  size: number;
  originalname?: string;
  buffer: Buffer;
};

type AudioConfig = {
  encoding: any;
  sampleRateHertz?: number;
};

function normalizeMime(mimetype: string) {
  return (mimetype || '').split(';')[0].trim().toLowerCase();
}

function getAudioConfig(mimetype: string): AudioConfig {
  const mime = normalizeMime(mimetype);

  if (
    mime === 'audio/ogg' ||
    mime === 'audio/opus' ||
    mime === 'application/ogg'
  ) {
    return {
      encoding: 'OGG_OPUS',
      sampleRateHertz: 48000,
    };
  }

  if (mime === 'audio/webm' || mime === 'video/webm') {
    return {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
    };
  }

  if (mime === 'audio/wav' || mime === 'audio/x-wav') {
    return { encoding: 'LINEAR16' };
  }

  if (mime === 'audio/mpeg' || mime === 'audio/mp3') {
    return { encoding: 'MP3' };
  }

  throw new Error(`Unsupported audio mimetype: ${mimetype}`);
}

export async function transcribeAudioWithGoogle(
  file: UploadedFile,
): Promise<string> {
  const client = getGoogleSpeechClient();

  if (!client) {
    throw new Error('Speech client not available');
  }

  if (!file?.buffer?.length) {
    throw new Error('Empty audio buffer');
  }

  const audioConfig = getAudioConfig(file.mimetype);
  const audioBytes = file.buffer.toString('base64');

  let response: any;

  try {
    const [res] = await client.recognize({
      audio: { content: audioBytes },
      config: {
        ...audioConfig,
        languageCode: 'es-PE',
        enableAutomaticPunctuation: true,
      },
    });

    response = res;
  } catch (err: any) {
    throw new Error(err?.message || 'Google Speech-to-Text failed');
  }

  const transcript =
    response?.results
      ?.map((r: any) => r?.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join('\n') ?? '';

  const finalText = transcript.trim();

  if (!finalText) {
    throw new Error(
      'Speech-to-Text no devolvió resultados (audio sin voz, codec/config incorrecta, sample rate mismatch o audio largo).',
    );
  }

  return finalText;
}

export type TtsFormat = 'mp3' | 'ogg';

export type TtsOptions = {
  text: string;
  languageCode?: string;
  voiceName?: string;
  speakingRate?: number;
  pitch?: number;
  format?: TtsFormat;
};

export async function synthesizeTextWithGoogle(
  options: TtsOptions,
): Promise<{ buffer: Buffer; mimeType: string }> {
  const client = getGoogleTtsClient();

  const {
    text,
    languageCode = 'es-PE',
    voiceName,
    speakingRate = 1.0,
    pitch = 0.0,
    format = 'mp3',
  } = options;

  if (!text?.trim()) {
    throw new Error('Text is required');
  }

  const request: any = {
    input: { text },
    voice: {
      languageCode,
      ...(voiceName ? { name: voiceName } : {}),
    },
    audioConfig: {
      audioEncoding: format === 'ogg' ? 'OGG_OPUS' : 'MP3',
      speakingRate,
      pitch,
    },
  };

  const [response] = await client.synthesizeSpeech(request);

  if (!response.audioContent) {
    throw new Error('TTS did not return audio');
  }

  const buffer = Buffer.isBuffer(response.audioContent)
    ? response.audioContent
    : Buffer.from(response.audioContent as any);

  return {
    buffer,
    mimeType: format === 'ogg' ? 'audio/ogg' : 'audio/mpeg',
  };
}
