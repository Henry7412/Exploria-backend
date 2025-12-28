import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisClientService {
  private readonly defaultTTL: number;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    this.defaultTTL = 3600;
  }

  async getItem(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async createItem(key: string, value: any): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async updateItem(key: string, value: any): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async deleteItem(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async hasItem(key: string): Promise<boolean> {
    const item = await this.cacheManager.get(key);
    return !!item;
  }
}
