import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BackOfficeCreditsModule } from '@/Application/BackOffice/Credits/BackOfficeCredits.module';
import { GetPlansUsersUseCase } from '@/Application/BackOffice/Plan/Application/Get/GetPlansUsers.useCase';
import { UpdatePlanUserCancelUseCase } from '@/Application/BackOffice/Plan/Application/Put/UpdatePlanUserCancel.useCase';
import { UpdatePlanUserPaidUseCase } from '@/Application/BackOffice/Plan/Application/Put/UpdatePlanUserPaid.useCase';
import { GetPlansUsersController } from '@/Application/BackOffice/Plan/Infrastructure/Controllers/GetPlansUsers.controller';
import { UpdatePlanUserCancelController } from '@/Application/BackOffice/Plan/Infrastructure/Controllers/UpdatePlanUserCancel.controller';
import { UpdatePlanUserPaidController } from '@/Application/BackOffice/Plan/Infrastructure/Controllers/UpdatePlanUserPaid.controller';
import { PlanRepository } from '@/Application/BackOffice/Plan/Infrastructure/Repositories/Plan.repository';
import { PlansService } from '@/Application/BackOffice/Plan/Infrastructure/Services/Plans.service';
import { SubscriptionsStrategy } from '@/Application/BackOffice/Plan/Strategies/Subscriptions.strategy';
import { SubscriptionsModule } from '@/Application/BackOffice/Subscriptions/Subscriptions.module';
import { UserModule } from '@/Application/Common/User/User.module';
import { NotificationsModule } from '@/Application/Insights/Notifications/Notifications.module';
import { PlanSchema } from '@/Shared/Domain/Schemas/Plan.schema';
import { SubscriptionsSchema } from '@/Shared/Domain/Schemas/Subscriptions.schema';
import { UserSchema } from '@/Shared/Domain/Schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Plans', schema: PlanSchema },
      { name: 'Subscriptions', schema: SubscriptionsSchema },
      { name: 'User', schema: UserSchema },
    ]),
    forwardRef(() => BackOfficeCreditsModule),
    forwardRef(() => SubscriptionsModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => UserModule),
  ],
  controllers: [
    GetPlansUsersController,
    UpdatePlanUserCancelController,
    UpdatePlanUserPaidController,
  ],
  providers: [
    PlanRepository,
    PlansService,
    SubscriptionsStrategy,
    GetPlansUsersUseCase,
    UpdatePlanUserCancelUseCase,
    UpdatePlanUserPaidUseCase,
  ],
  exports: [PlanRepository, PlansService],
})
export class PlanModule {}
