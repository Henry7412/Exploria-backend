import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { I18nService } from 'nestjs-i18n';

import { CreditsDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/Credits.dto';
import { CreditsPaginationDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/CreditsPagination.dto';
import { CreditTypeDto } from '@/Application/BackOffice/Credits/Infrastructure/Dto/CreditType.dto';
import { BackOfficeCreditsRepository } from '@/Application/BackOffice/Credits/Infrastructure/Repositories/BackOfficeCredits.repository';
import { UserRepository } from '@/Application/Common/User/Infrastructure/Repositories/User.repository';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { NotificationTypesEnum } from '@/Shared/Infrastructure/Common/Enum/NotificationTypes.enum';
import { PaymentStatusEnum } from '@/Shared/Infrastructure/Common/Enum/PaymentStatus.enum';
import { messageI18n } from '@/Shared/Infrastructure/Helper/I18n.helper';
import { CreditsStrategy } from '@/Application/BackOffice/Credits/Infrastructure/Strategies/Credits.strategy';
import { PackagesRepository } from '@/Application/BackOffice/Packages/Infrastructure/Repositories/Packages.repository';

@Injectable()
export class BackOfficeCreditsService {
  constructor(
    private readonly backOfficeCreditsRepository: BackOfficeCreditsRepository,
    private readonly userRepository: UserRepository,
    private readonly packagesRepository: PackagesRepository,
    private readonly i18n: I18nService,
    private readonly creditsStrategy: CreditsStrategy,
  ) {}

  async listCredits(creditsPaginationDto: CreditsPaginationDto): Promise<any> {
    const { page, pageSize } = creditsPaginationDto;

    const credits =
      await this.backOfficeCreditsRepository.getAllCreditsWithOrderCode(
        page,
        pageSize,
      );

    const total =
      await this.backOfficeCreditsRepository.countAllCreditsWithOrderCode();

    return {
      data: {
        items: credits,
        pagination: {
          page,
          pageSize,
          total,
        },
      },
    };
  }

  async updateCancelCredits(creditsDto: CreditsDto): Promise<any> {
    const updatedCredit = await this.backOfficeCreditsRepository.updateCredit(
      creditsDto.id,
      {
        payment: PaymentStatusEnum.CANCELED,
        updatedAt: new Date(),
      },
    );

    if (updatedCredit) {
      const user = await this.userRepository.findById(updatedCredit.userId);
      const packageData = await this.packagesRepository.findById(
        updatedCredit.packageId,
      );

      if (user && packageData) {
        await this.creditsStrategy.notifyUserCredit(
          user,
          packageData.credits ?? 0,
          NotificationTypesEnum.CREDIT_PURCHASE_CANCELLED,
        );
      }
    }
  }

  async updatePaidCredits(
    creditsDto: CreditsDto,
    creditTypeDto: CreditTypeDto,
  ): Promise<any> {
    const now = new Date();

    const updatedCredit = await this.backOfficeCreditsRepository.updateCredit(
      creditsDto.id,
      {
        payment: PaymentStatusEnum.PAID,
        file: creditTypeDto.file,
        updatedAt: now,
      },
    );

    if (!updatedCredit) {
      throw new BadRequestException(
        messageI18n(this.i18n, 'validation.credit_not_found'),
      );
    }

    const packageId = updatedCredit.packageId;
    if (!packageId) {
      throw new BadRequestException(
        messageI18n(this.i18n, 'validation.package_not_found'),
      );
    }

    const user = await this.userRepository.findById(updatedCredit.userId);
    const packageData = await this.packagesRepository.findById(packageId);

    if (user && packageData) {
      await this.creditsStrategy.notifyUserCredit(
        user,
        packageData.credits ?? 0,
        NotificationTypesEnum.CONFIRMED_CREDIT_PURCHASE,
      );
    }

    return;
  }

  async creditsDetail(authDto: AuthDto, creditsDto: CreditsDto): Promise<any> {
    if (!authDto || !authDto._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.unauthorized'),
      );
    }

    const credit = await this.backOfficeCreditsRepository.findDetailById(
      creditsDto.id,
    );

    if (!credit) {
      throw new NotFoundException(
        messageI18n(this.i18n, 'validation.creditNotFound'),
      );
    }

    return {
      data: {
        credit: {
          _id: credit._id,
          quantity: credit.quantity,
          provide: credit.provide,
          status: credit.status,
          coin: credit.coin,
          amount: credit.amount,
          file: credit.file,
          payment: credit.payment,
        },
        user: credit.userId
          ? {
              _id: credit.userId._id,
              names: credit.userId.names,
              lastNames: credit.userId.lastNames,
            }
          : null,
        package: credit.packageId
          ? {
              _id: credit.packageId._id,
              name: credit.packageId.name,
            }
          : null,
      },
    };
  }
}
