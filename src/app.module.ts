import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@/Shared/Infrastructure/Jwt/Jwt.module';
import { AuthModule } from '@/Application/Common/Auth/Auth.module';
import { EnvConfigModule } from '@/Shared/Infrastructure/Config/Env.main';
import { RedisConfigMain } from '@/Shared/Infrastructure/Config/Redis/RedisConfig.main';
import { I18nConfigMain } from '@/Shared/Infrastructure/Common/Language/I18nConfig.main';
import { MongoConfigMain } from '@/Shared/Infrastructure/Config/Mongo/MongoConfig.main';
import { RouterModule } from '@/Shared/Infrastructure/Route/Router.module';
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
    EnvConfigModule,
    ScheduleModule.forRoot(),
    JwtModule,
    AuthModule,
    MongoConfigMain,
    RedisConfigMain,
    I18nConfigMain,
    RouterModule,
    UserModule,
    ChatBotModule,
    CreditsModule,
    BackOfficeCreditsModule,
    PackagesModule,
    NotificationsModule,
    PackageModule,
    PlanModule,
    SubscriptionsModule,
    LandingPlanModule,
    RagModule,
    WhatsAppModule,
  ],
})
export class AppModule {}
