import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokensService } from '../../tokens/tokens.service';
import { USER_METADATA_KEY } from '../../users/decorators/user.param';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersRepository } from 'src/common/modules/pg-database/repositories/users.repo';
import { EMetadataKeys } from 'src/common/types/metadata-keys.enum';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly tokensService: TokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.headers['authorization'];

    if (!accessToken) {
      throw new ForbiddenException('token is not valid');
    }

    const decodedToken = await this.tokensService.verifyAccessJwt<UserEntity>(
      accessToken,
    );
    if (!decodedToken) {
      throw new ForbiddenException('token is not valid');
    }

    const user = await this.usersRepo.getOneByParams({
      throwError: false,
      where: {
        id: decodedToken.id,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const acceptedRoles = Reflect.getMetadata(
      EMetadataKeys.ROLES,
      context.getHandler(),
    );

    if (acceptedRoles && !acceptedRoles.includes(user.role)) {
      throw new ForbiddenException('not accepted user role');
    }

    Reflect.defineMetadata(USER_METADATA_KEY, user, context.getHandler());

    return true;
  }
}
