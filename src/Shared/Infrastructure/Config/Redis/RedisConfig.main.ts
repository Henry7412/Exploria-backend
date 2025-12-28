import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheModuleAsyncOptions } from '@nestjs/common/cache';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientService } from './Service/RedisClient.service';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      store: await redisStore({
        socket: {
          host: configService.get<string>('CLUSTER_HOST_REDIS'),
          port: parseInt(configService.get<string>('REDIS_DB_PORT')),
        },
        database: 1,
      }),
    };
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    CacheModule.registerAsync(RedisOptions),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('CLUSTER_HOST_REDIS'),
          port: parseInt(configService.get<string>('REDIS_DB_PORT')),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisConfigMain {}
