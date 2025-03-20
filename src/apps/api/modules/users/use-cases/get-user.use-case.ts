import { Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/common/types/use-case.interface';
import { UsersRepository } from '../../../../../common/modules/pg-database/repositories/users.repo';
import { UserEntity } from '../entities/user.entity';

export class GetUserCommand {
  userId: string;

  constructor(params: GetUserCommand) {
    Object.assign(this, params);
  }
}

@Injectable()
export class GetUserUseCase implements IUseCase<GetUserCommand, UserEntity> {
  constructor(private readonly _usersRepo: UsersRepository) {}

  async execute(command: GetUserCommand): Promise<UserEntity> {
    const { userId } = command;

    const user = await this._usersRepo
      .getRepository()
      .findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
