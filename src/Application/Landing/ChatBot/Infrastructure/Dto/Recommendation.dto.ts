import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ActionTypeEnum } from '@/Shared/Infrastructure/Common/Enum/ActionType.enum';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class RecommendationDto {
  @IsNotEmpty()
  @IsEnum(ActionTypeEnum)
  action: ActionTypeEnum;

  @IsOptional()
  @Transform(({ value }) => (value ? new Types.ObjectId(value) : null))
  chatId: Types.ObjectId | null;

  @IsNotEmpty()
  deviceId: string;
}
