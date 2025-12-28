import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PlanRepository } from '@/Application/BackOffice/Plan/Infrastructure/Repositories/Plan.repository';
import { SubscriptionsRepository } from '@/Application/BackOffice/Subscriptions/Infrastructure/Repositories/Subscriptions.repository';
import { UserRepository } from '@/Application/Common/User/Infrastructure/Repositories/User.repository';
import { NotificationsDocument } from '@/Shared/Domain/Schemas/Notifications.schema';
import { NotificationTypesEnum } from '@/Shared/Infrastructure/Common/Enum/NotificationTypes.enum';
import { NotificationsRepository } from '@/Application/Insights/Notifications/Infrastruture/Repositories/Notifications.repository';

@Injectable()
export class SubscriptionCronService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly notificationsRepository: NotificationsRepository,
    private readonly userRepository: UserRepository,
    private readonly planRepository: PlanRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleExpiredSubscriptions() {
    const now = new Date();

    const expiredSubs = await this.subscriptionsRepository.findExpired(now);

    const userExpiredSubs = expiredSubs.filter((sub) => !!sub.userId);
    if (userExpiredSubs.length === 0) return;

    const freeUserPlan = await this.planRepository.findOne({
      name: 'PLAN_FREE',
      client: 'USER',
    });

    for (const sub of userExpiredSubs) {
      await this.subscriptionsRepository.update(sub._id, {
        status: 'EXPIRED',
        plan: freeUserPlan._id,
      });

      await this.userRepository.update(sub.userId, {
        plan: freeUserPlan._id,
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleSubscriptionDueToExpire() {
    const expiringSubs =
      await this.subscriptionsRepository.findExpiringSubscriptions();

    const userExpiringSubs = expiringSubs.filter((sub) => !!sub.userId);
    if (userExpiringSubs.length === 0) return;

    for (const sub of userExpiringSubs) {
      const user = await this.userRepository.findById(sub.userId);
      if (!user) continue;

      const notifications: Partial<NotificationsDocument>[] = [];

      const contactLink = user.phoneNumber
        ? `https://wa.me/${user.phoneNumber}?text=Tu%20suscripción%20vence%20pronto`
        : null;

      const notificationText = contactLink
        ? `Tu suscripción está por vencer. ${contactLink}`
        : `Tu suscripción está por vencer.`;

      notifications.push({
        type: NotificationTypesEnum.SUBSCRIPTION_EXPIRING,
        user: user._id,
        read: false,
        visible: true,
        data: { message: notificationText },
        createdAt: new Date(),
      });

      if (notifications.length) {
        await this.notificationsRepository.bulkInsert(notifications);
      }
    }
  }
}
