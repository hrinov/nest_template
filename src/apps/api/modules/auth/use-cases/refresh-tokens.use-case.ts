import { IUseCase } from 'src/common/types/use-case.interface';
import { Injectable } from '@nestjs/common';
import { InvalidRefreshTokenException } from 'src/common/exceptions/invalid-refresh-token.exception';
import { TTokensPair } from '../../tokens/types/tokens';
import { TokensService } from '../../tokens/tokens.service';
import { UserEntity } from '../../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from 'src/common/modules/pg-database/repositories/users.repo';

export class RefreshTokensCommand {
  refreshToken?: string;

  constructor(params: RefreshTokensCommand) {
    Object.assign(this, params);
  }
}

@Injectable()
export class RefreshTokensUseCase
  implements IUseCase<RefreshTokensCommand, TTokensPair>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly tokensService: TokensService,
  ) {}

  async execute(command: RefreshTokensCommand): Promise<TTokensPair> {
    if (!command.refreshToken) {
      throw new InvalidRefreshTokenException();
    }

    const decodedToken = await this.tokensService.verifyRefreshJwt<UserEntity>(
      command.refreshToken,
    );

    if (!decodedToken) {
      throw new InvalidRefreshTokenException();
    }

    const userEntity = await this.usersRepo
      .getRepository()
      .find({ where: { email: decodedToken.email } });

    if (!userEntity) {
      throw new NotFoundException();
    }

    const tokens = await this.tokensService.generateJwtPair(userEntity);
    return tokens;
  }
}
