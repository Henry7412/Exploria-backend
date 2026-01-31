import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisVectorClient implements OnModuleInit {
  readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.CLUSTER_HOST_REDIS,
      port: Number(process.env.REDIS_DB_PORT),
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
    } catch (e: any) {
      if (!String(e.message).includes('Index already exists')) {
        throw e;
      }
      console.log('ℹ️ Índice RAG ya existe');
    }
  }
}
