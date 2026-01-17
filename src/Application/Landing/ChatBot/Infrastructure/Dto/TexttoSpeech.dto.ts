import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class TextToSpeechDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  languageCode?: string;

  @IsOptional()
  @IsString()
  voiceName?: string;

  @IsOptional()
  @IsIn(['mp3', 'ogg'])
  format?: 'mp3' | 'ogg';

  @IsOptional()
  @IsNumber()
  @Min(0.25)
  @Max(4.0)
  speakingRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(-20)
  @Max(20)
  pitch?: number;
}
