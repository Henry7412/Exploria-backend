import { IsNotEmpty } from 'class-validator';
import { UploadedFile } from '@/Shared/Infrastructure/Utils/Files';

export class AudioDto {
  @IsNotEmpty()
  file: UploadedFile;
}
