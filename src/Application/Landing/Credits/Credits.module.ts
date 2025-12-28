import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '@/Application/Common/User/User.module';
import { CreditsRepository } from '@/Application/Landing/Credits/Infrastructure/Repositories/Credits.repository';
import { CreditsSchema } from '@/Shared/Domain/Schemas/Credits.schema';
import { UserSchema } from '@/Shared/Domain/Schemas/User.schema';
import { LandingCreditsService } from '@/Application/Landing/Credits/Infrastructure/Services/LandingCredits.service';
import { CreditsUserRequestUseCase } from '@/Application/Landing/Credits/Application/Post/CreditUserRequest.useCase';
import { CreditsStrategy } from '@/Application/BackOffice/Credits/Infrastructure/Strategies/Credits.strategy';
import { PackagesModule } from '@/Application/BackOffice/Packages/Packages.module';
import { BackOfficeCreditsModule } from '@/Application/BackOffice/Credits/BackOfficeCredits.module';
import { NotificationsModule } from '@/Application/Insights/Notifications/Notifications.module';
import { CreditsUserRequestController } from '@/Application/Landing/Credits/Infrastructure/Controllers/CreditsUserRequest.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Credits', schema: CreditsSchema },
      { name: 'User', schema: UserSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => PackagesModule),
    forwardRef(() => BackOfficeCreditsModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [CreditsUserRequestController],
  providers: [
    CreditsRepository,
    LandingCreditsService,
    CreditsUserRequestUseCase,
    CreditsStrategy,
  ],
  exports: [CreditsRepository],
})
export class CreditsModule {}
