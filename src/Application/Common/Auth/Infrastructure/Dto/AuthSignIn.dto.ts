import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthSignInDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  emailOrPhone?: string;

  @IsOptional()
  password: string;
}
