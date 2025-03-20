import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { openTelemetryConfig } from 'src/common/configs/open-telemetry.config';
import { IRedisConfig, redisConfig } from 'src/common/configs/redis.config';
import { typeormConfig } from 'src/common/configs/typeorm.config';
import { ConfigNames } from 'src/common/types/config-names.enum';
import { UsersModule } from './modules/users/users.module';
import { CachingModule } from './modules/caching/caching.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { AuthModule } from './modules/auth/auth.module';
import { tokensConfig } from 'src/common/configs/tokens.config';
import appConfig from 'src/common/configs/app.config';
import { PgDatabaseModule } from 'src/common/modules/pg-database/pg-database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, openTelemetryConfig, redisConfig, tokensConfig],
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
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 40,
      },
    ]),
    PgDatabaseModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeormConfig),
    CachingModule,
    TokensModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
