import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthorizeUserUseCase } from './use-cases/authorize-user.use.case';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { PgDatabaseModule } from 'src/common/modules/pg-database/pg-database.module';
import { JwtGuard } from './guards/jwt.guard';
import { Module } from '@nestjs/common';
import { RefreshTokensUseCase } from './use-cases/refresh-tokens.use-case';
import { TokensModule } from '../tokens/tokens.module';
import { EncryptionService } from './services/encription.service';

@Module({
  providers: [
    AuthService,
    AuthorizeUserUseCase,
    RegisterUserUseCase,
    RefreshTokensUseCase,
    JwtGuard,
    EncryptionService,
  ],
  controllers: [AuthController],
  imports: [PgDatabaseModule, TokensModule],
  exports: [JwtGuard, TokensModule],
})
export class AuthModule {}
