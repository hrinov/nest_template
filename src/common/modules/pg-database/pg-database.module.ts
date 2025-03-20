import { Module, Provider } from '@nestjs/common';
import { PgDatabaseService } from './pg-database.service';
import { UsersRepository } from './repositories/users.repo';

const REPOSITORIES: Provider[] = [UsersRepository, PgDatabaseService];

@Module({
  providers: REPOSITORIES,
  exports: REPOSITORIES,
})
export class PgDatabaseModule {}
