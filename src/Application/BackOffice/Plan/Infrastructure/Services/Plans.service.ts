import { BadRequestException, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { I18nService } from 'nestjs-i18n';

import { PlanDto } from '@/Application/BackOffice/Plan/Infrastructure/Dto/Plan.dto';
import { PlanTypeDto } from '@/Application/BackOffice/Plan/Infrastructure/Dto/PlanType.dto';
import { PlanRepository } from '@/Application/BackOffice/Plan/Infrastructure/Repositories/Plan.repository';
import { UserRepository } from '@/Application/Common/User/Infrastructure/Repositories/User.repository';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { NotificationTypesEnum } from '@/Shared/Infrastructure/Common/Enum/NotificationTypes.enum';
import { PaymentStatusEnum } from '@/Shared/Infrastructure/Common/Enum/PaymentStatus.enum';
import { UsersPlanDto } from '@/Application/BackOffice/Plan/Infrastructure/Dto/UsersPlan.dto';
import { messageI18n } from '@/Shared/Infrastructure/Helper/I18n.helper';
import { SubscriptionsRepository } from '@/Application/BackOffice/Subscriptions/Infrastructure/Repositories/Subscriptions.repository';
import { SubscriptionsStrategy } from '@/Application/BackOffice/Plan/Strategies/Subscriptions.strategy';

@Injectable()
export class PlansService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly i18n: I18nService,
    private readonly subscriptionStrategy: SubscriptionsStrategy,
    private readonly userRepository: UserRepository,
  ) {}

  async listUsersPlan(
    authDto: AuthDto,
    usersPlanDto: UsersPlanDto,
  ): Promise<any> {
    const { page, pageSize } = usersPlanDto;

    if (!authDto || !authDto._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.unauthorized'),
      );
    }

    const { data, total } = await this.planRepository.listPaginatedUsersPlan(
      page,
      pageSize,
    );

    return {
      data: {
        items: data,
        pagination: {
          page,
          pageSize,
          total,
        },
      },
    };
  }

  async updateCancelPlanUser(
    authDto: AuthDto,
    planTDto: PlanDto,
  ): Promise<any> {
    const subscription = await this.subscriptionsRepository.findById(
      planTDto.id,
    );
    if (!subscription) return;

    const plan = await this.planRepository.findOne({ _id: subscription.plan });

    await this.planRepository.updatePlan(planTDto.id, {
      payment: PaymentStatusEnum.CANCELED,
      updatedAt: new Date(),
      updatedBy: {
        names: authDto.names,
        lastNames: authDto.lastNames,
        picture: authDto.picturePath ?? null,
      },
    });

    await this.subscriptionStrategy.notifyUserSubscription(
      authDto,
      plan?.credits ?? 0,
      NotificationTypesEnum.SUBSCRIPTION_PURCHASE_CANCELLED,
    );
  }

  async updatePaidPlanUser(
    authDto: AuthDto,
    planTDto: PlanDto,
    planTypeDto: PlanTypeDto,
  ): Promise<any> {
    await this.planRepository.updatePlan(planTDto.id, {
      payment: PaymentStatusEnum.PAID,
      file: planTypeDto.file,
      updatedAt: new Date(),
      updatedBy: {
        names: authDto.names,
        lastNames: authDto.lastNames,
        picture: authDto.picturePath ?? null,
      },
    });

    const subscription = await this.subscriptionsRepository.findById(
      planTDto.id,
    );
    if (!subscription) {
      throw new BadRequestException(
        messageI18n(this.i18n, 'validation.subscription_not_found'),
      );
    }

    const plan = await this.planRepository.findOne({ _id: subscription.plan });
    if (!plan) {
      throw new BadRequestException(
        messageI18n(this.i18n, 'validation.plan_is_not_available'),
      );
    }

    await this.userRepository.assignSubscriptionAndPlanToUser(
      subscription.userId,
      subscription._id,
      plan._id,
    );

    await this.subscriptionStrategy.notifyUserSubscription(
      authDto,
      plan.credits ?? 0,
      NotificationTypesEnum.CONFIRMED_SUBSCRIPTION_PURCHASE,
    );
  }
}
