import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { GetUserCommand, GetUserUseCase } from './use-cases/get-user.use-case';
import {
  UpdateUserCommand,
  UpdateUserUseCase,
} from './use-cases/update-user.use-case';
import {
  GetAllUsersUseCase,
  GetUserListCommand,
} from './use-cases/get-all-users.use-case';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from './configs/user-pagination-config';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from './decorators/user.param';
import { UserEntity } from './entities/user.entity';
import { EUserRoles } from './types';
import { UseRoles } from '../auth/decorators/roles.decorator';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly _getUserUseCase: GetUserUseCase,
    private readonly _getAllUsersUseCase: GetAllUsersUseCase,
    private readonly _updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Get()
  @UseRoles([EUserRoles.USER, EUserRoles.ADMIN])
  @UseGuards(JwtGuard)
  @ApiBearerAuth('user')
  @ApiResponse({ type: UserResponseDTO })
  async getUser(@User() user: UserEntity) {
    const command = new GetUserCommand({
      userId: user.id,
    });
    const userData = await this._getUserUseCase.execute(command);
    return new UserResponseDTO(userData);
  }

  @Put()
  @UseRoles([EUserRoles.USER, EUserRoles.ADMIN])
  @UseGuards(JwtGuard)
  @ApiBearerAuth('user')
  async updateUser(
    @User() user: UserEntity,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<void> {
    const command = new UpdateUserCommand({
      userId: user.id,
      updateData: updateUserDTO,
    });
    await this._updateUserUseCase.execute(command);
  }

  @Get('/list')
  @UseRoles([EUserRoles.ADMIN])
  @UseGuards(JwtGuard)
  @ApiBearerAuth('admin')
  @ApiResponse({ type: UserResponseDTO, isArray: true })
  @PaginatedSwaggerDocs(UserResponseDTO, USER_PAGINATION_CONFIG)
  async getUsers(@Paginate() query: PaginateQuery) {
    const command = new GetUserListCommand({ query });
    return await this._getAllUsersUseCase.execute(command);
  }
}
