import { PaginateConfig } from 'nestjs-paginate';

import { UserEntity } from 'src/apps/api/modules/users/entities/user.entity';

export const USER_PAGINATION_CONFIG: PaginateConfig<UserEntity> = {
  sortableColumns: ['name', 'email', 'created_at', 'updated_at'],
  searchableColumns: ['name', 'email'],
  filterableColumns: {
    name: true,
    email: true,
    created_at: true,
    updated_at: true,
  },
  defaultSortBy: [['created_at', 'DESC']],
  defaultLimit: 10,
  relations: {},
};
