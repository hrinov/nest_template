import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Mutex } from 'async-mutex';

@Injectable()
export class UpdateCacheCron {
  private readonly _logger = new Logger(UpdateCacheCron.name);
  private readonly _updateCacheMutex = new Mutex();

  @Cron(CronExpression.EVERY_MINUTE)
  async updateTotalUsersCache() {
    const release = await this._updateCacheMutex.acquire();
    try {
      this._logger.log('Here we can use cron to update cache');
    } catch (error) {
      this._logger.error('[updateCountriesCache] | Global error:');
      this._logger.error(error);
    } finally {
      release();
    }
  }
}
