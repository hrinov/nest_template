import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CheckUsersConsumer } from './check-users.consumer';
import { CHECK_USERS_QUEUE } from '../../constants/queues';

@Module({
  providers: [CheckUsersConsumer],
  imports: [
    BullModule.registerQueue({
      name: CHECK_USERS_QUEUE,
    }),
  ],
})
export class CheckUsersModule {}
