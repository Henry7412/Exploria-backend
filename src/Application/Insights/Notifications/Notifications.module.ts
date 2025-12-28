import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationsSchema } from '@/Shared/Domain/Schemas/Notifications.schema';
import { NotificationsRepository } from '@/Application/Insights/Notifications/Infrastruture/Repositories/Notifications.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notifications', schema: NotificationsSchema },
    ]),
  ],
  controllers: [],
  providers: [NotificationsRepository],
  exports: [NotificationsRepository],
})
export class NotificationsModule {}
