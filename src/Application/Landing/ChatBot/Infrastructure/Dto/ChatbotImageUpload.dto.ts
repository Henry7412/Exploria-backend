import { IsNotEmpty } from 'class-validator';

export class ChatbotImageUploadDto {
  @IsNotEmpty()
  file: any;
}
