import { IsNotEmpty, IsString } from 'class-validator';

export class MessagesDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  @IsString()
  deviceId?: string;
}
