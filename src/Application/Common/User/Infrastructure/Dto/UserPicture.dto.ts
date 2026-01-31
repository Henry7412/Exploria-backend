import { IsNotEmpty } from 'class-validator';

export class UserPictureDto {
  @IsNotEmpty()
  file: any;
}
