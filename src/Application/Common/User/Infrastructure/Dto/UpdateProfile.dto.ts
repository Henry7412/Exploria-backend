import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { InterestEnum } from '@/Shared/Infrastructure/Common/Enum/Interest.enum';
import { LanguagesEnum } from '@/Shared/Infrastructure/Common/Enum/Languages.enum';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  names: string;

  @IsOptional()
  @IsString()
  lastNames: string;

  @IsOptional()
  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  picture: string;

  @IsOptional()
  @IsString()
  dateOfBirth: string;

  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value))
  nationality: Types.ObjectId;

  @IsOptional()
  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  hobbies: string;

  @IsOptional()
  @IsEnum(LanguagesEnum, { each: true })
  @IsArray()
  languages: LanguagesEnum;

  @IsOptional()
  @IsString()
  aboutMe: string;

  @IsOptional()
  @IsArray()
  @IsEnum(InterestEnum, { each: true })
  interest?: InterestEnum[];

  @IsOptional()
  @IsString()
  funFact: string;

  @IsOptional()
  @IsString()
  favoriteFoods: string;

  @IsOptional()
  @IsString()
  medicalConsiderations: string;
}
