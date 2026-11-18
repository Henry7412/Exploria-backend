import * as fs from 'fs';
import * as path from 'path';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

let _speechClient: SpeechClient | null = null;
let _ttsClient: TextToSpeechClient | null = null;

function resolveGoogleCredentialsPath(): string | undefined {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
  const localPath = path.resolve(
    process.cwd(),
    'src/Storage/Credentials/SpeechToText.json',
  );
  if (fs.existsSync(localPath)) {
    return localPath;
  }
  return undefined;
}

export function getGoogleSpeechClient(): SpeechClient {
  if (!_speechClient) {
    const keyFilename = resolveGoogleCredentialsPath();
    if (!keyFilename) {
      throw new Error(
        'Google Speech credentials not found. Set GOOGLE_APPLICATION_CREDENTIALS or place SpeechToText.json in src/Storage/Credentials/.',
      );
    }
    _speechClient = new SpeechClient({ keyFilename });
  }

  return _speechClient;
}

export function getGoogleTtsClient(): TextToSpeechClient {
  if (!_ttsClient) {
    const keyFilename = resolveGoogleCredentialsPath();
    if (!keyFilename) {
      throw new Error(
        'Google TTS credentials not found. Set GOOGLE_APPLICATION_CREDENTIALS or place SpeechToText.json in src/Storage/Credentials/.',
      );
    }
    _ttsClient = new TextToSpeechClient({ keyFilename });
  }

  return _ttsClient;
}
