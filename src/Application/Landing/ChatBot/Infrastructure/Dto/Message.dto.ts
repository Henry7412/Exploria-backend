import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MessagesDto {
  @IsOptional()
  @IsString()
  value?: string;

  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @IsOptional()
  file?: {
    originalname: string;
    mimetype: string;
    size: number;
    bufferBase64: string;
  };
}
