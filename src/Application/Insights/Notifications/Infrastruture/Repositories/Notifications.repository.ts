import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@/Shared/Infrastructure/Repositories/Base.repository';
import {
  Notifications,
  NotificationsDocument,
} from '@/Shared/Domain/Schemas/Notifications.schema';

export class NotificationsRepository extends BaseRepository<Notifications> {
  constructor(
    @InjectModel('Notifications')
    private readonly notificationsModel: Model<Notifications>,
  ) {
    super(notificationsModel);
  }

  async bulkInsert(notifications: Partial<NotificationsDocument>[]) {
    return this.notificationsModel.insertMany(notifications);
  }
}
