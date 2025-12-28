import { IsBoolean } from 'class-validator';

export class PackageDisableDto {
  @IsBoolean()
  disable: boolean;
}
