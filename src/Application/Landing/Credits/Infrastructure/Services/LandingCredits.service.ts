import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';

import { BackOfficeCreditsRepository } from '@/Application/BackOffice/Credits/Infrastructure/Repositories/BackOfficeCredits.repository';
import { UserRepository } from '@/Application/Common/User/Infrastructure/Repositories/User.repository';
import { PackageIdDto } from '@/Application/Landing/Credits/Infrastructure/Dto/PackageId.dto';
import { CreditsRepository } from '@/Application/Landing/Credits/Infrastructure/Repositories/Credits.repository';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { CreditProvideEnum } from '@/Shared/Infrastructure/Common/Enum/CreditProvide.enum';
import { CreditStatusEnum } from '@/Shared/Infrastructure/Common/Enum/CreditsStatus.enum';
import { PaymentStatusEnum } from '@/Shared/Infrastructure/Common/Enum/PaymentStatus.enum';
import { messageI18n } from '@/Shared/Infrastructure/Helper/I18n.helper';
import { NotificationTypesEnum } from '@/Shared/Infrastructure/Common/Enum/NotificationTypes.enum';
import { CreditsStrategy } from '@/Application/BackOffice/Credits/Infrastructure/Strategies/Credits.strategy';
import { PackagesRepository } from '@/Application/BackOffice/Packages/Infrastructure/Repositories/Packages.repository';

@Injectable()
export class LandingCreditsService {
  constructor(
    private readonly backOfficeCreditsRepository: BackOfficeCreditsRepository,
    private readonly i18n: I18nService,
    private readonly userRepository: UserRepository,
    private readonly packagesRepository: PackagesRepository,
    private readonly creditsRepository: CreditsRepository,
    private readonly creditsStrategy: CreditsStrategy,
  ) {}

  async requestUserCredits(
    authDto: AuthDto,
    packageIdDto: PackageIdDto,
  ): Promise<any> {
    const userId = authDto._id;
    const now = new Date();

    if (!packageIdDto.package) {
      throw new BadRequestException(
        messageI18n(this.i18n, 'validation.package_not_found'),
      );
    }

    const packageData = await this.packagesRepository.findOne({
      _id: new Types.ObjectId(packageIdDto.package),
    });

    if (!packageData) {
      throw new BadRequestException(
        messageI18n(this.i18n, 'validation.package_not_found'),
      );
    }

    const orderCode = await this.creditsRepository.generateOrderCode();

    const creditDoc = await this.backOfficeCreditsRepository.create({
      userId,
      quantity: packageData.credits ?? 0,
      provide: CreditProvideEnum.SALE,
      status: CreditStatusEnum.CREDITED,
      active: true,
      amount: packageData.amount ?? 0,
      payment: PaymentStatusEnum.REQUESTED,
      createdAt: now,
      packageId: packageData._id,
      orderCode,
    });

    const user = await this.userRepository.findById(userId);

    await this.creditsRepository.updateOne(
      { _id: (creditDoc as any)._id },
      {
        $push: {
          logs: {
            status: CreditStatusEnum.CREDITED,
            provide: CreditProvideEnum.SALE,
            quantity: packageData.credits,
            createdAt: now,
            createdBy: {
              names: user?.names ?? '',
              lastNames: user?.lastNames ?? '',
              picture: user?.picture ?? '',
            },
          },
        },
      },
    );

    await this.creditsStrategy.notifyUserCredit(
      user,
      packageData.credits ?? 0,
      NotificationTypesEnum.CREDIT_PURCHASE_REQUESTED,
    );

    return { orderCode: creditDoc.orderCode };
  }
}
