import { Global, Module, Logger } from '@nestjs/common';
import { CachingService } from './caching.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { IRedisConfig } from 'src/common/configs/redis.config';
import { ConfigNames } from 'src/common/types/config-names.enum';

const logger = new Logger('Redis');

@Global()
@Module({
  providers: [CachingService],
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const cfg = configService.getOrThrow<IRedisConfig>(ConfigNames.REDIS);
        return {
          type: 'single',
          options: {
           ...cfg,
            db: cfg.cacheDb,
          },
        };
      },
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const cfg = configService.getOrThrow<IRedisConfig>(ConfigNames.REDIS);
        const redis = await redisStore({
          database: cfg.cacheDb,
          username: cfg.user,
          password: cfg.password,
          socket: {
            host: cfg.host,
            port: cfg.port,
            tls: !!cfg.tls,
          },
        });

        redis.client.on('error', (err) => logger.error(`Redis Error: ${err}`));

        return {
          isGlobal: true,
          store: redis,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [CachingService],
})
export class CachingModule {}
