import { Module } from '@nestjs/common';
import { UpdateCacheCron } from './update-cache.cron';

@Module({
  providers: [
    UpdateCacheCron,
  ],
  imports: [],
})
export class UpdateCacheModule {}
