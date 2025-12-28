import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SubscriptionCronService } from '@/Application/BackOffice/Subscriptions/CronJob/SubscriptionCron.service';
import { SubscriptionsRepository } from '@/Application/BackOffice/Subscriptions/Infrastructure/Repositories/Subscriptions.repository';
import { UserModule } from '@/Application/Common/User/User.module';
import { NotificationsModule } from '@/Application/Insights/Notifications/Notifications.module';
import { SubscriptionsSchema } from '@/Shared/Domain/Schemas/Subscriptions.schema';

import { PlanModule } from '../Plan/Plan.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Subscriptions', schema: SubscriptionsSchema },
    ]),
    forwardRef(() => PlanModule),
    NotificationsModule,
    forwardRef(() => UserModule),
  ],
  controllers: [],
  providers: [SubscriptionsRepository, SubscriptionCronService],
  exports: [SubscriptionsRepository],
})
export class SubscriptionsModule {}
