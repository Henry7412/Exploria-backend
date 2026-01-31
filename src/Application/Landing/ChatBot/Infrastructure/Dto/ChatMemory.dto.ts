import { Transform, Type } from 'class-transformer';
import {
  IsArray,
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
  @IsArray({ message: 'Las perspectivas deben ser una lista' })
  @IsEnum(ProfessionalViewEnum, {
    each: true,
    message: 'La perspectiva seleccionada no es válida',
  })
  @Type(() => String)
  perspectives: ProfessionalViewEnum[];

  @IsOptional()
  @IsArray({ message: 'Los tonos de voz deben ser una lista' })
  @IsEnum(VoiceToneEnum, {
    each: true,
    message: 'El tono de voz seleccionado no es válido',
  })
  @Type(() => String)
  voiceTones: VoiceToneEnum[];

  @IsOptional()
  @IsBoolean({ message: 'El campo user debe ser verdadero o falso' })
  user?: boolean;
}
