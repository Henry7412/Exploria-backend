import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class PackageIdDto {
  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value))
  package: Types.ObjectId;
}
