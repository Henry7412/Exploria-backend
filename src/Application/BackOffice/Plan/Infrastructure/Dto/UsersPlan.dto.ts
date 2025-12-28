import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UsersPlanDto {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  page: number = 1;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  pageSize: number = 10;
}
