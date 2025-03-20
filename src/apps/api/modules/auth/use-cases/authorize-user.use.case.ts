import { IUseCase } from 'src/common/types/use-case.interface';
import { Injectable } from '@nestjs/common';
import { TAuthResult } from '../types/auth';
import { TokensService } from '../../tokens/tokens.service';
import { UsersRepository } from 'src/common/modules/pg-database/repositories/users.repo';
import { EncryptionService } from '../services/encription.service';
import { CustomBadRequestException } from 'src/common/exceptions/custom-bad-request.exception';

export class AuthorizeUserCommand {
  email: string;
  password: string;

  constructor(params: AuthorizeUserCommand) {
    Object.assign(this, params);
  }
}

@Injectable()
export class AuthorizeUserUseCase
  implements IUseCase<AuthorizeUserCommand, TAuthResult>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly tokensService: TokensService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async execute(command: AuthorizeUserCommand): Promise<TAuthResult> {
    const user = await this.usersRepo
      .getRepository()
      .findOne({ where: { email: command.email } });

    if (!user) {
      throw new CustomBadRequestException('Admin not found');
    }

    const isPasswordValid = await this.encryptionService.compareStringWithHash(
      command.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new CustomBadRequestException('Invalid password');
    }

    await this.usersRepo.save(user);

    const tokens = await this.tokensService.generateJwtPair(user);
    return { tokens, user };
  }
}
