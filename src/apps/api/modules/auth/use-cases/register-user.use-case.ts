import { CustomBadRequestException } from 'src/common/exceptions/custom-bad-request.exception';
import { IUseCase } from 'src/common/types/use-case.interface';
import { Injectable } from '@nestjs/common';
import { TAuthResult } from '../types/auth';
import { EncryptionService } from '../services/encription.service';
import { UsersRepository } from 'src/common/modules/pg-database/repositories/users.repo';
import { TokensService } from '../../tokens/tokens.service';

export class RegisterUserCommand {
  email: string;
  name: string;
  password: string;

  constructor(params: RegisterUserCommand) {
    Object.assign(this, params);
  }
}

@Injectable()
export class RegisterUserUseCase
  implements IUseCase<RegisterUserCommand, TAuthResult>
{
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly usersRepo: UsersRepository,
    private readonly tokensService: TokensService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<TAuthResult> {
    let user = await this.usersRepo
      .getRepository()
      .findOne({ where: { email: command.email } });

    if (user) {
      throw new CustomBadRequestException(`User already exists`);
    }

    const hashedPassword = await this.encryptionService.generateHashFromString(
      command.password,
    );
    command.password = hashedPassword;

    user = await this.usersRepo.create(command);
    const tokens = await this.tokensService.generateJwtPair(user);

    return { tokens, user };
  }
}
