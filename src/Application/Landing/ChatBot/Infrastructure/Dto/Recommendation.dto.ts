import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { ActionTypeEnum } from '@/Shared/Infrastructure/Common/Enum/ActionType.enum';

export class RecommendationDto {
  @IsOptional()
  @IsString()
  @IsEnum(ActionTypeEnum)
  action: ActionTypeEnum;

  @IsOptional()
  @Transform(({ value }) => (value ? new Types.ObjectId(value) : null))
  chatId: Types.ObjectId | null;

  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
