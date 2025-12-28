import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CreditsStrategy } from '@/Application/BackOffice/Credits/Infrastructure/Strategies/Credits.strategy';

import { CreditsSchema } from '@/Shared/Domain/Schemas/Credits.schema';
import { PackagesSchema } from '@/Shared/Domain/Schemas/Packages.schema';
import { SubscriptionsSchema } from '@/Shared/Domain/Schemas/Subscriptions.schema';
import { UserSchema } from '@/Shared/Domain/Schemas/User.schema';
import { GetCreditsController } from '@/Application/BackOffice/Credits/Infrastructure/Controllers/GetCredits.controller';
import { UpdateCreditsPaidController } from '@/Application/BackOffice/Credits/Infrastructure/Controllers/UpdateCreditsPaid.controller';
import { UpdateCreditsCancelController } from '@/Application/BackOffice/Credits/Infrastructure/Controllers/UpdateCreditsCancel.contorller';
import { CreditsDetailController } from '@/Application/BackOffice/Credits/Infrastructure/Controllers/CreditsDetail.controller';
import { BackOfficeCreditsService } from '@/Application/BackOffice/Credits/Infrastructure/Services/BackOfficeCredits.service';
import { BackOfficeCreditsRepository } from '@/Application/BackOffice/Credits/Infrastructure/Repositories/BackOfficeCredits.repository';
import { GetCreditsUseCase } from '@/Application/BackOffice/Credits/Application/Get/GetCredits.useCase';
import { UpdateCreditsPaidUseCase } from '@/Application/BackOffice/Credits/Application/Put/UpdateCreditsPaid.useCase';
import { UpdateCreditsCancelUseCase } from '@/Application/BackOffice/Credits/Application/Put/UpdateCreditsCancel.useCase';
import { CreditsDetailUseCase } from '@/Application/BackOffice/Credits/Application/Get/CreditsDetil.useCase';
import { UserModule } from '@/Application/Common/User/User.module';
import { CreditsModule } from '@/Application/Landing/Credits/Credits.module';
import { PackagesModule } from '@/Application/BackOffice/Packages/Packages.module';
import { NotificationsModule } from '@/Application/Insights/Notifications/Notifications.module';
import { PlanModule } from '@/Application/BackOffice/Plan/Plan.module';
import { SubscriptionsModule } from '@/Application/BackOffice/Subscriptions/Subscriptions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Credits', schema: CreditsSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Subscriptions', schema: SubscriptionsSchema },
      { name: 'Packages', schema: PackagesSchema },
    ]),
    forwardRef(() => PlanModule),
    forwardRef(() => UserModule),
    forwardRef(() => CreditsModule),
    forwardRef(() => SubscriptionsModule),
    forwardRef(() => PackagesModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [
    GetCreditsController,
    UpdateCreditsPaidController,
    UpdateCreditsCancelController,
    CreditsDetailController,
  ],
  providers: [
    BackOfficeCreditsService,
    BackOfficeCreditsRepository,
    GetCreditsUseCase,
    UpdateCreditsPaidUseCase,
    UpdateCreditsCancelUseCase,
    CreditsDetailUseCase,
    CreditsStrategy,
  ],
  exports: [BackOfficeCreditsService, BackOfficeCreditsRepository],
})
export class BackOfficeCreditsModule {}
