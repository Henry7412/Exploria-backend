import { Types } from 'mongoose';

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
// export async function transcribeAudioWithGoogle(
//   file: UploadedFile,
// ): Promise<string> {
//   const client = getGoogleSpeechClient();
//
//   const audioBytes = file.buffer.toString('base64');
//
//   const [response] = await client.recognize({
//     audio: { content: audioBytes },
//     config: {
//       encoding: 'MP3',
//       sampleRateHertz: 16000,
//       languageCode: 'es-PE',
//     },
//   });
//
//   const transcript = response.results
//     ?.map((r) => r.alternatives?.[0]?.transcript)
//     .join('\n');
//
//   return transcript ?? 'No se pudo transcribir el audio';
// }
