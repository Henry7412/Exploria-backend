// export type GeminiPart =
//   | { text: string }
//   | { inlineData: { mimeType: string; data: string } };
//
// export function messageToText(value: any): string {
//   if (value == null) return '';
//
//   if (typeof value === 'string') return value;
//
//   if (typeof value === 'object') {
//     // ✅ modelo: { value, actions }
//     if (typeof value.value === 'string') return value.value;
//
//     // ✅ user multimodal: { text, image }
//     if (typeof value.text === 'string') return value.text;
//
//     try {
//       return JSON.stringify(value);
//     } catch {
//       return '';
//     }
//   }
//
//   return String(value);
// }
//
// export function dbMessageToGemini(
//   msg: any,
// ): { role: 'user' | 'model'; parts: GeminiPart[] } | null {
//   const role: 'user' | 'model' = msg.role === 'user' ? 'user' : 'model'; // system se trata como model
//
//   const text = messageToText(msg.value).trim();
//   if (!text) return null;
//
//   return {
//     role,
//     parts: [{ text }],
//   };
// }
//
// export function buildCurrentUserParts(
//   text?: string,
//   inlineImagePart?: GeminiPart | null,
// ): GeminiPart[] {
//   const parts: GeminiPart[] = [];
//
//   if (text) parts.push({ text });
//   if (inlineImagePart) parts.push(inlineImagePart);
//
//   if (!parts.length) parts.push({ text: '' });
//
//   return parts;
// }
