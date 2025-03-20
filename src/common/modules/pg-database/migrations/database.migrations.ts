import { DataSource, DataSourceOptions } from 'typeorm';
import { typeormConfig } from 'src/common/configs/typeorm.config';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: typeormConfig.host,
  port: typeormConfig.port,
  username: typeormConfig.username,
  password: typeormConfig.password,
  database: typeormConfig.database,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: false,
  synchronize: false,
  logging: typeormConfig.logging,
  ssl: typeormConfig.ssl
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
  poolSize: typeormConfig.poolSize,
  extra: {
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 5000,
  },
};

const AppSource = new DataSource(typeOrmConfig);

export default AppSource;
