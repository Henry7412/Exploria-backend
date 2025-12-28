import { IsNotEmpty, IsString } from 'class-validator';

export class StoreChatDto {
  @IsNotEmpty()
  @IsString()
  deviceId?: string;
}
