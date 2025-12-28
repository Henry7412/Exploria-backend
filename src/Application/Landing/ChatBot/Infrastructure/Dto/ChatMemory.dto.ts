import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

import { ProfessionalViewEnum } from '@/Shared/Infrastructure/Common/Enum/ProfessionalView.enum';
import { VoiceToneEnum } from '@/Shared/Infrastructure/Common/Enum/VoiceTone.enum';

export class ChatMemoryDto {
  @IsNotEmpty({ message: 'Chat ID is required' })
  @Transform(({ value }) => {
    if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
      return new Types.ObjectId(value);
    }
    return value;
  })
  @Type(() => String)
  chatId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  medicalConsiderations: string;

  @IsOptional()
  @IsString()
  favoriteFoods: string;

  @IsOptional()
  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  funFact: string;

  @IsOptional()
  @IsEnum(ProfessionalViewEnum, { each: true })
  @Type(() => String)
  perspectives: ProfessionalViewEnum[];

  @IsOptional()
  @IsEnum(VoiceToneEnum, { each: true })
  @Type(() => String)
  voiceTones: VoiceToneEnum[];

  @IsNotEmpty()
  @IsBoolean()
  user: boolean;
}
