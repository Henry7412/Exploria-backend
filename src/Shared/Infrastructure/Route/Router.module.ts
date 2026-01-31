import { Module } from '@nestjs/common';
import { RouterModule as Router } from '@nestjs/core';
import { AuthModule } from '@/Application/Common/Auth/Auth.module';
import { UserModule } from '@/Application/Common/User/User.module';
import { ChatBotModule } from '@/Application/Landing/ChatBot/ChatBot.module';
import { CreditsModule } from '@/Application/Landing/Credits/Credits.module';
import { BackOfficeCreditsModule } from '@/Application/BackOffice/Credits/BackOfficeCredits.module';
import { PackagesModule } from '@/Application/BackOffice/Packages/Packages.module';
import { NotificationsModule } from '@/Application/Insights/Notifications/Notifications.module';
import { PackageModule } from '@/Application/Landing/Package/Package.module';
import { PlanModule } from '@/Application/BackOffice/Plan/Plan.module';
import { SubscriptionsModule } from '@/Application/BackOffice/Subscriptions/Subscriptions.module';
import { LandingPlanModule } from '@/Application/Landing/Plan/LandingPlan.module';
import { RagModule } from '@/Application/Landing/Rag/Rag.module';
import { WhatsAppModule } from '@/Application/Landing/WhatsApp/whatsAppModule';

@Module({
  imports: [
    AuthModule,
    UserModule,
    Router.register([
      { path: 'api/v1', module: AuthModule },
      { path: 'api/v1', module: UserModule },
      { path: 'api/v1', module: ChatBotModule },
      { path: 'api/v1', module: CreditsModule },
      { path: 'api/v1', module: BackOfficeCreditsModule },
      { path: 'api/v1', module: PackagesModule },
      { path: 'api/v1', module: NotificationsModule },
      { path: 'api/v1', module: PackageModule },
      { path: 'api/v1', module: PlanModule },
      { path: 'api/v1', module: SubscriptionsModule },
      { path: 'api/v1', module: LandingPlanModule },
      { path: 'api/v1', module: RagModule },
      { path: 'api/v1', module: WhatsAppModule },
    ]),
  ],
})
export class RouterModule {}
