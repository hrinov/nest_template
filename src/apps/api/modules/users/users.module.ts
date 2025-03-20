import { Module } from '@nestjs/common';
import { PgDatabaseModule } from '../../../../common/modules/pg-database/pg-database.module';
import { UsersController } from './users.controller';
import { GetUserUseCase } from './use-cases/get-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { GetAllUsersUseCase } from './use-cases/get-all-users.use-case';
import { AuthModule } from '../auth/auth.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  controllers: [UsersController],
  providers: [GetUserUseCase, UpdateUserUseCase, GetAllUsersUseCase],
  imports: [PgDatabaseModule, AuthModule, TokensModule],
})
export class UsersModule {}
