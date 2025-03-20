import { Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/common/types/use-case.interface';
import { UsersRepository } from '../../../../../common/modules/pg-database/repositories/users.repo';
import { UpdateUserDTO } from '../dto/update-user.dto';

export class UpdateUserCommand {
  userId: string;
  updateData: UpdateUserDTO;

  constructor(params: UpdateUserCommand) {
    Object.assign(this, params);
  }
}

@Injectable()
export class UpdateUserUseCase implements IUseCase<UpdateUserCommand, void> {
  constructor(private readonly _usersRepo: UsersRepository) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const { userId, updateData } = command;

    const user = await this._usersRepo.getOneByParams({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateData);

    await this._usersRepo.save(user);
  }
}
