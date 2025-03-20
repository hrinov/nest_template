import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import {
  booleanStringToBoolean,
  TBooleanString,
} from '../utils/boolean-string-to-boolean';
config();

const logger = new Logger('PgDBConfig');

export type TTypeormConfig = {
  type: 'postgres';
  host: string;
  port: number;
  password: string;
  username: string;
  database: string;
  entities: string[];
  migrations: string[];
  migrationsRun: boolean;
  synchronize: boolean;
  logging: boolean;
  ssl?: {
    rejectUnauthorized: boolean;
  };
  poolSize: number;
  extra: {
    connectionTimeoutMillis: number;
    idleTimeoutMillis: number;
  };
};

const getDatabaseConfig = () => {
  const props = [
    'PGHOST',
    'PGUSER',
    'PGPASSWORD',
    'PGDATABASE',
    'PGPORT',
    'DB_IS_LOGGER_ENABLED',
    'DB_IS_SSL_ENABLED',
  ];

  for (const prop of props) {
    if (!process.env[prop]) {
      throw new Error(`[PgDbConfig]: variable ${prop} is not configured`);
    }
  }

  const host = process.env.PGHOST;
  const login = process.env.PGUSER;
  const password = process.env.PGPASSWORD;
  const dbName = process.env.PGDATABASE;
  const port = +process.env.PGPORT;

  const isActiveLogger = booleanStringToBoolean(
    process.env.DB_IS_LOGGER_ENABLED as TBooleanString,
  );

  const isSSL = booleanStringToBoolean(
    process.env.DB_IS_SSL_ENABLED as TBooleanString,
  );

  const poolSize = +process.env.DB_POOL_SIZE;

  if (!poolSize) {
    logger.warn(`Pool size is not configured. Using default value`);
  }

  if (!isSSL) {
    logger.warn(`Running without ssl`);
  }

  if (!isActiveLogger) {
    logger.warn(`Running without active logger`);
  }

  return {
    type: 'postgres',
    host,
    port,
    password,
    username: login,
    database: dbName,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/**/*.js'],
    migrationsRun: false,
    synchronize: false,
    logging: isActiveLogger,
    ssl: isSSL
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
    poolSize,
    extra: {
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 5000,
    },
  } as TTypeormConfig;
};

export const typeormConfig: TTypeormConfig = getDatabaseConfig();
