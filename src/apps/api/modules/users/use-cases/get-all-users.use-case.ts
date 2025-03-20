import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/types/use-case.interface';
import { UsersRepository } from '../../../../../common/modules/pg-database/repositories/users.repo';
import { UserEntity } from '../entities/user.entity';
import { PaginateQuery } from 'nestjs-paginate';
import { CustomPaginatedData } from 'src/common/configs/base-clases/custom-paginated-data';
import { UserResponseDTO } from '../dto/user-response.dto';

export class GetUserListCommand {
  query: PaginateQuery;

  constructor(params: GetUserListCommand) {
    Object.assign(this, params);
  }
}

@Injectable()
export class GetAllUsersUseCase
  implements
    IUseCase<
      GetUserListCommand,
      CustomPaginatedData<UserEntity, UserResponseDTO>
    >
{
  constructor(private readonly _usersRepo: UsersRepository) {}

  async execute(
    command: GetUserListCommand,
  ): Promise<CustomPaginatedData<UserEntity, UserResponseDTO>> {
    const paginateData = await this._usersRepo.getUsersList(command.query);

    return new CustomPaginatedData<UserEntity, UserResponseDTO>({
      data: paginateData.data.map((user) => new UserResponseDTO(user)),
      meta: paginateData.meta,
      links: paginateData.links,
    });
  }
}
