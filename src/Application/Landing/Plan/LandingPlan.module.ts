import { Module } from '@nestjs/common';

import { BackOfficeCreditsModule } from '@/Application/BackOffice/Credits/BackOfficeCredits.module';
import { PlanModule } from '@/Application/BackOffice/Plan/Plan.module';
import { SubscriptionsStrategy } from '@/Application/BackOffice/Plan/Strategies/Subscriptions.strategy';
import { SubscriptionsModule } from '@/Application/BackOffice/Subscriptions/Subscriptions.module';
import { UserModule } from '@/Application/Common/User/User.module';
import { NotificationsModule } from '@/Application/Insights/Notifications/Notifications.module';
import { CreditsModule } from '@/Application/Landing/Credits/Credits.module';
import { GetLandingPlansUseCase } from '@/Application/Landing/Plan/Application/Get/GetLandingPlans.useCase';
import { PlanUserRequestUseCase } from '@/Application/Landing/Plan/Application/Post/PlanUserRequest.useCase';
import { GetLadingPlansController } from '@/Application/Landing/Plan/Infrastructure/Controllers/GetLadingPlans.controller';
import { PlanUserRequestController } from '@/Application/Landing/Plan/Infrastructure/Controllers/PlanUserRequest.controller';
import { LandingPlanService } from '@/Application/Landing/Plan/Infrastructure/Services/LandingPlan.service';

@Module({
  imports: [
    UserModule,
    PlanModule,
    SubscriptionsModule,
    BackOfficeCreditsModule,
    CreditsModule,
    NotificationsModule,
  ],
  controllers: [PlanUserRequestController, GetLadingPlansController],
  providers: [
    LandingPlanService,
    PlanUserRequestUseCase,
    SubscriptionsStrategy,
    GetLandingPlansUseCase,
  ],
  exports: [LandingPlanService],
})
export class LandingPlanModule {}
