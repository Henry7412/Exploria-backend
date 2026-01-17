import * as path from 'path';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

let _speechClient: SpeechClient | null = null;
let _ttsClient: TextToSpeechClient | null = null;

export function getGoogleSpeechClient(): SpeechClient {
  if (!_speechClient) {
    const keyPath = path.resolve(
      process.cwd(),
      'src/Storage/Credentials/SpeechToText.json',
    );

    _speechClient = new SpeechClient({ keyFilename: keyPath });
  }

  return _speechClient;
}

export function getGoogleTtsClient(): TextToSpeechClient {
  if (!_ttsClient) {
    const keyPath = path.resolve(
      process.cwd(),
      'src/Storage/Credentials/SpeechToText.json',
    );

    _ttsClient = new TextToSpeechClient({ keyFilename: keyPath });
  }

  return _ttsClient;
}
