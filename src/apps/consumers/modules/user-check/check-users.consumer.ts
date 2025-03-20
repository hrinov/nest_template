import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { CHECK_USERS_QUEUE } from '../../constants/queues';

// Example
@Processor({ name: CHECK_USERS_QUEUE })
export class CheckUsersConsumer {
  private readonly _logger = new Logger(CheckUsersConsumer.name);

  // constructor() {}

  @Process({ concurrency: 1 })
  async process(job: Job<unknown>): Promise<void> {
    this._logger.error(`Here we can implement consumer logic`);
  }
}
