import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisVectorClient implements OnModuleInit {
  private readonly logger = new Logger(RedisVectorClient.name);
  readonly redis: Redis;
  isVectorEnabled = false;

  constructor() {
    this.redis = new Redis({
      host: process.env.CLUSTER_HOST_REDIS || '127.0.0.1',
      port: Number(process.env.REDIS_DB_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
    });
    this.redis.on('error', (err) => {
      this.logger.warn(`RedisVector connection error: ${err.message}`);
    });
  }

  async onModuleInit() {
    await this.createIndex();
  }

  async createIndex() {
    try {
      await this.redis.call(
        'FT.CREATE',
        'idx:rag',
        'ON',
        'HASH',
        'PREFIX',
        '1',
        'rag:',
        'SCHEMA',
        'content',
        'TEXT',
        'embedding',
        'VECTOR',
        'HNSW',
        '6',
        'TYPE',
        'FLOAT32',
        'DIM',
        '768',
        'DISTANCE_METRIC',
        'COSINE',
      );
      this.isVectorEnabled = true;
    } catch (e: any) {
      const msg = String(e?.message || e);
      if (msg.includes('Index already exists')) {
        this.isVectorEnabled = true;
        this.logger.log('Índice RAG ya existe');
        return;
      }
      this.isVectorEnabled = false;
      this.logger.warn(
        `RediSearch no disponible (${msg}). El RAG vectorial quedará deshabilitado.`,
      );
    }
  }
}
