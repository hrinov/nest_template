import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { openTelemetryConfig } from 'src/common/configs/open-telemetry.config';
import { redisConfig } from 'src/common/configs/redis.config';
import { typeOrmConfig } from 'src/common/modules/pg-database/migrations/database.migrations';
import { UpdateCacheModule } from './modules/update-cache/update-cache.module';
import appConfig from 'src/common/configs/app.config';
import { CachingModule } from '../api/modules/caching/caching.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, redisConfig, openTelemetryConfig],
      isGlobal: true,
    }),
    CachingModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({ ...typeOrmConfig, migrationsRun: true }),
    UpdateCacheModule,
  ],
})
export class AppModule {}
