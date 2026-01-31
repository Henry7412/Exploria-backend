import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { BackOfficeCreditsRepository } from '@/Application/BackOffice/Credits/Infrastructure/Repositories/BackOfficeCredits.repository';
import { PlanRepository } from '@/Application/BackOffice/Plan/Infrastructure/Repositories/Plan.repository';
import { SubscriptionsStrategy } from '@/Application/BackOffice/Plan/Strategies/Subscriptions.strategy';
import { SubscriptionsRepository } from '@/Application/BackOffice/Subscriptions/Infrastructure/Repositories/Subscriptions.repository';
import { calculateEndDate } from '@/Application/BackOffice/Subscriptions/Infrastructure/Strategy/Subscription.strategy';
import { UserRepository } from '@/Application/Common/User/Infrastructure/Repositories/User.repository';
import { SubscriptionIdDto } from '@/Application/Landing/Plan/Infrastructure/Dto/SubscriptionId.Dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { CoinTypesEnum } from '@/Shared/Infrastructure/Common/Enum/CoinTypes.enum';
import { CreditProvideEnum } from '@/Shared/Infrastructure/Common/Enum/CreditProvide.enum';
import { CreditStatusEnum } from '@/Shared/Infrastructure/Common/Enum/CreditStatus.enum';
import { NotificationTypesEnum } from '@/Shared/Infrastructure/Common/Enum/NotificationTypes.enum';
import { PaymentStatusEnum } from '@/Shared/Infrastructure/Common/Enum/PaymentStatus.enum';
import { SubscriptionStatusEnum } from '@/Shared/Infrastructure/Common/Enum/SubscriptionStatus.enum';
import { messageI18n } from '@/Shared/Infrastructure/Helper/I18n.helper';

@Injectable()
export class LandingPlanService {
  constructor(
    private readonly i18n: I18nService,
    private readonly planRepository: PlanRepository,
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly userRepository: UserRepository,
    private readonly backOfficeCreditsRepository: BackOfficeCreditsRepository,
    private readonly subscriptionStrategy: SubscriptionsStrategy,
  ) {}

  async planUserRequest(
    authDto: AuthDto,
    subscriptionIdDto: SubscriptionIdDto,
  ): Promise<any> {
    const userId = authDto._id;
    const now = new Date();

    const plan = await this.planRepository.findOne({
      _id: subscriptionIdDto.plan,
      active: true,
    });

    if (!plan) {
      throw new BadRequestException(
        messageI18n(this.i18n, 'validation.plan_is_not_available'),
      );
    }

    const price = subscriptionIdDto.annual
      ? plan.amount - plan.discount
      : plan.amount;

    const creditsToAdd = plan.credits ?? 0;
    const endDate = calculateEndDate(plan, now);

    const activeUsersSubscription =
      await this.subscriptionsRepository.findActiveByUser(userId);

    let status: SubscriptionStatusEnum = SubscriptionStatusEnum.ACTIVE;

    if (activeUsersSubscription) {
      const activePlan = await this.planRepository.findOne({
        _id: activeUsersSubscription.plan,
      });

      const currentLevel = this.subscriptionStrategy.getUserPlanLevel(
        activePlan?.name,
      );
      const newLevel = this.subscriptionStrategy.getUserPlanLevel(plan.name);

      if (newLevel > currentLevel) {
        await this.subscriptionsRepository.update(
          (activeUsersSubscription as any)._id,
          {
            status: SubscriptionStatusEnum.PAUSED,
            updatedAt: now,
          },
        );
      } else if (newLevel < currentLevel) {
        status = SubscriptionStatusEnum.IN_COMING;
      } else {
        throw new BadRequestException(
          messageI18n(this.i18n, 'validation.plan_is_not_available'),
        );
      }
    }

    const orderCode = await this.planRepository.generateOrderCode();

    const subscription = await this.subscriptionsRepository.create({
      userId,
      plan: plan._id,
      status,
      payment: PaymentStatusEnum.REQUESTED,
      coin: CoinTypesEnum.PEN,
      startDate: now,
      endDate,
      amount: price,
      annual: subscriptionIdDto.annual,
      createdAt: now,
      updatedAt: null,
      createdBy: {
        names: authDto.names,
        lastNames: authDto.lastNames,
        picture: authDto.picturePath ?? null,
      },
      orderCode,
    });

    await this.userRepository.update(userId, {
      subscriptionId: subscription._id,
    });

    if (creditsToAdd > 0) {
      const creditDoc = await this.backOfficeCreditsRepository.create({
        userId,
        subscriptionId: subscription._id,
        quantity: creditsToAdd,
        provide: CreditProvideEnum.SUBSCRIPTION,
        status: CreditStatusEnum.CREDITED,
        active: true,
        amount: 0,
        createdAt: now,
      });

      await (creditDoc as any).save?.();

      await this.subscriptionStrategy.notifyUserSubscription(
        authDto,
        creditsToAdd ?? 0,
        NotificationTypesEnum.SUBSCRIPTION_PURCHASE_REQUESTED,
      );
    }

    return { orderCode };
  }

  async getLandingPlans(): Promise<any> {
    const plans = await this.planRepository.findActivePlans();

    const userPlans = plans.filter((plan) => plan.client === 'USER');

    return { user: userPlans };
  }
}
