import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class PgDatabaseService {
  private readonly hashMap = new Map<string, bigint>();

  getCustomLockKey(value: string): bigint {
    if (!this.hashMap.has(value)) {
      const hmac = createHmac('sha1', value);
      const hash = hmac.digest('hex').slice(0, 10);
      const num = BigInt(parseInt(hash, 16));

      this.hashMap.set(value, num);
    }

    return this.hashMap.get(value);
  }
}
