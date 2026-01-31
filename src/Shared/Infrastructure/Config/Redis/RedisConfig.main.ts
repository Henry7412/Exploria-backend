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
    const host = configService.get<string>('CLUSTER_HOST_REDIS');
    const port = Number(configService.get<string>('REDIS_DB_PORT'));
    const password = configService.get<string>('REDIS_PASSWORD');

    return {
      store: await redisStore({
        socket: {
          host,
          port,
        },
        password, // ✅ nuevo
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
          port: Number(configService.get<string>('REDIS_DB_PORT')),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisConfigMain {}
