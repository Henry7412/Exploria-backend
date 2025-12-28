import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthRegisterDto {
  @IsNotEmpty()
  @MinLength(3)
  names: string;

  @IsNotEmpty()
  @MinLength(3)
  lastNames: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  emailOrPhone?: string;

  @IsOptional()
  password: string;
}
