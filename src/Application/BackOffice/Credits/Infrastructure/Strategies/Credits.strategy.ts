import { Injectable } from '@nestjs/common';

import { NotificationTypesEnum } from '@/Shared/Infrastructure/Common/Enum/NotificationTypes.enum';
import { NotificationsRepository } from '@/Application/Insights/Notifications/Infrastruture/Repositories/Notifications.repository';

@Injectable()
export class CreditsStrategy {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async notifyUserCredit(
    user: any,
    credits: number,
    type: NotificationTypesEnum,
  ) {
    const notification = {
      type,
      user: user._id,
      read: false,
      visible: true,
      data: {
        message: `Se te han acreditado ${credits} créditos en tu cuenta.`,
      },
      createdBy: {
        names: user.names || '',
        lastNames: user.lastNames || '',
        picture: user.picture || '',
      },
      createdAt: new Date(),
    };

    await this.notificationsRepository.bulkInsert([notification]);
  }
}
