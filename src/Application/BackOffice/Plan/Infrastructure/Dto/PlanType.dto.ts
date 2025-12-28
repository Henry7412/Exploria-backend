import { IsOptional, IsString } from 'class-validator';

export class PlanTypeDto {
  @IsOptional()
  @IsString()
  file: string;
}
