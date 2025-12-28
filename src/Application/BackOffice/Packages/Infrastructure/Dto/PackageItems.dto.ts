import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { CoinTypesEnum } from '@/Shared/Infrastructure/Common/Enum/CoinTypes.enum';

export class PackageItemsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  credits: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(CoinTypesEnum)
  coin: CoinTypesEnum;
}
