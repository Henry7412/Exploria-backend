import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class PackageDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  id: Types.ObjectId;
}
