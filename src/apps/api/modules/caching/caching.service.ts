import { Injectable } from '@nestjs/common';
import Redis, { RedisKey } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class CachingService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async set<T>(key: RedisKey, value: T, expire?: number) {
    if (expire) {
      return this.redisClient.set(key, JSON.stringify(value), 'PX', expire);
    }

    return this.redisClient.set(key, JSON.stringify(value));
  }

  async get<T>(key: RedisKey): Promise<T> {
    const data = await this.redisClient.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  async del(key: RedisKey) {
    return this.redisClient.del(key);
  }

  async ttl(key: RedisKey) {
    return this.redisClient.ttl(key);
  }

  /**
   * Deletes keys by pattern in a non-blocking way
   * @param pattern Pattern to match the keys, e.g. 'mykey*'
   */
  async unlinkbypattern(pattern: string): Promise<number> {
    let cursor = 0;
    let totalDeleted = 0;

    do {
      const [newCursor, keys] = await this.redisClient.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = parseInt(newCursor);

      if (keys.length > 0) {
        // Use pipeline to delete multiple keys in one go
        const pipeline = this.redisClient.pipeline();
        keys.forEach((key) => pipeline.unlink(key));
        const results = await pipeline.exec();

        totalDeleted += results.filter((result) => result[1] === 1).length;
      }
    } while (cursor !== 0);

    return totalDeleted;
  }
}
