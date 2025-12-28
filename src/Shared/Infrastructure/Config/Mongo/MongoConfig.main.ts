import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('CLUSTER_URI_MONGO'),
        dbName: configService.get<string>('CLUSTER_DB_NAME_MONGO', 'main'),
      }),
    }),
  ],
})
export class MongoConfigMain {}
