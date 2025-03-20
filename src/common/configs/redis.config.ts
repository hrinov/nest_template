import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';
import { ConfigNames } from '../types/config-names.enum';
import {
  booleanStringToBoolean,
  TBooleanString,
} from '../utils/boolean-string-to-boolean';

config();

export interface IRedisConfig {
  host: string;
  port: number;
  bullDb: number;
  cacheDb: number;
  user: string;
  password: string;
  tls: { rejectUnauthorized: false } | undefined;
}

const getRedisConfig = () => {
  const props = [
    'REDISHOST',
    'REDISPORT',
    'REDIS_BULL_DB',
    'REDIS_CACHE_DB',
    'REDISUSER',
    'REDISPASSWORD',
  ];

  for (const prop of props) {
    if (!process.env[prop]) {
      throw new Error(`[RedisConfig]: variable ${prop} is not configured`);
    }
  }
  const host = process.env.REDISHOST;
  const port = +process.env.REDISPORT;
  const bullDb = +process.env.REDIS_BULL_DB;
  const cacheDb = +process.env.REDIS_CACHE_DB;
  const user = process.env.REDISUSER;
  const password = process.env.REDISPASSWORD;
  const tls = booleanStringToBoolean(
    process.env.REDIS_IS_TLS_ENABLED as TBooleanString,
  );

  const config: IRedisConfig = {
    host,
    port,
    bullDb,
    user,
    password,
    cacheDb,
    tls: tls ? { rejectUnauthorized: false } : undefined,
  };

  return config;
};

export const redisConfig = registerAs(ConfigNames.REDIS, getRedisConfig);
