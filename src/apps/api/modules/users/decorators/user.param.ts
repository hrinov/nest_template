import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserEntity } from '../entities/user.entity';

export const USER_METADATA_KEY = 'user';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    return Reflect.getMetadata(
      USER_METADATA_KEY,
      ctx.getHandler(),
    ) as UserEntity;
  },
);
