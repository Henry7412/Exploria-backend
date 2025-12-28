import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class SubscriptionIdDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  plan: Types.ObjectId;

  @IsNotEmpty()
  @IsBoolean()
  annual: boolean;
}
