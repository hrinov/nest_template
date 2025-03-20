import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../../../apps/api/modules/users/entities/user.entity';
import { BaseRepository } from '../base-classes/base-repository';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from 'src/apps/api/modules/users/configs/user-pagination-config';
import { RegisterUserCommand } from 'src/apps/api/modules/auth/use-cases/register-user.use-case';

@Injectable()
export class UsersRepository extends BaseRepository(UserEntity) {
  constructor(private readonly dataSource: DataSource) {
    super(dataSource);
  }

  async getUsersList(query: PaginateQuery): Promise<Paginated<UserEntity>> {
    return await paginate(query, this.getRepository(), USER_PAGINATION_CONFIG);
  }

  async create(data: RegisterUserCommand) {
    const { name, email, password } = data;
    return await this.save({
      name,
      email,
      password,
    });
  }
}
