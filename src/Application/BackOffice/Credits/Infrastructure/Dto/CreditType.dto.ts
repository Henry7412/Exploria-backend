import { IsOptional, IsString } from 'class-validator';

export class CreditTypeDto {
  @IsOptional()
  @IsString()
  file: string;
}
