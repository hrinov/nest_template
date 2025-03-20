import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisConfig, IRedisConfig } from 'src/common/configs/redis.config';
import { typeOrmConfig } from '../../common/modules/pg-database/migrations/database.migrations';
import { PgDatabaseModule } from '../../common/modules/pg-database/pg-database.module';
import { HealthModule } from '../../common/modules/health/health.module';
import { openTelemetryConfig } from 'src/common/configs/open-telemetry.config';
import { ConfigNames } from 'src/common/types/config-names.enum';
import { CachingModule } from '../api/modules/caching/caching.module';
import { CheckUsersModule } from './modules/user-check/check-users.module';
import appConfig from 'src/common/configs/app.config';

@Module({
  imports: [
    PgDatabaseModule,
    CachingModule,
    ConfigModule.forRoot({
      load: [appConfig, redisConfig, openTelemetryConfig],
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const cfg = configService.getOrThrow<IRedisConfig>(ConfigNames.REDIS);
        return {
          redis: {
            ...cfg,
            db: cfg.bullDb,
          },
        };
      },
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    HealthModule,
    CheckUsersModule,
  ],
})
export class AppModule {}
