import { Transform, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class ChatIdDto {
  @IsNotEmpty({ message: 'Chat ID is required' })
  @Transform(({ value }) => {
    if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
      return new Types.ObjectId(value);
    }
    return value;
  })
  @Type(() => String)
  chatId: Types.ObjectId;
}
