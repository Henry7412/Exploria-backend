import { Injectable } from '@nestjs/common';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { NotificationTypesEnum } from '@/Shared/Infrastructure/Common/Enum/NotificationTypes.enum';
import { NotificationsRepository } from '@/Application/Insights/Notifications/Infrastruture/Repositories/Notifications.repository';

@Injectable()
export class SubscriptionsStrategy {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async notifyUserSubscription(
    authDto: AuthDto,
    creditsToAdd: any,
    type: NotificationTypesEnum,
  ) {
    const notification = {
      type,
      user: authDto._id,
      read: false,
      visible: true,
      data: {
        message: `Se te han acreditado ${creditsToAdd} créditos en tu cuenta.`,
      },
      createdBy: {
        names: authDto.names || '',
        lastNames: authDto.lastNames || '',
        picture: authDto.picturePath || '',
      },
      createdAt: new Date(),
    };
    await this.notificationsRepository.bulkInsert([notification]);
  }

  readonly planLevels: Record<string, number> = {
    PLAN_FREE: 1,
    PLAN_ENTREPRENEUR: 2,
    PLAN_PREMIUM: 3,
  };

  getPlanLevel(planName: string): number {
    return this.planLevels[planName] ?? 0;
  }

  readonly userPlanLevels: Record<string, number> = {
    PLAN_FREE: 1,
    PLAN_WEEKLY: 2,
    PLAN_MONTHLY: 3,
  };

  getUserPlanLevel(planName: string): number {
    return this.userPlanLevels[planName] ?? 0;
  }
}
