import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { Request, Response } from 'express';
import {
  RefreshTokensCommand,
  RefreshTokensUseCase,
} from './use-cases/refresh-tokens.use-case';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ITokensConfig } from 'src/common/configs/tokens.config';
import {
  AuthorizeUserCommand,
  AuthorizeUserUseCase,
} from './use-cases/authorize-user.use.case';
import {
  RegisterUserCommand,
  RegisterUserUseCase,
} from './use-cases/register-user.use-case';
import { ConfigService } from '@nestjs/config';
import { ConfigNames } from 'src/common/types/config-names.enum';
import { AuthResponseDTO } from './dto/auth.response.dto';
import { DAY } from 'src/common/constants/time';
import { RegisterDTO } from './dto/register.dto';
import { TokensResponseDTO } from '../tokens/dto/tokens.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly tokensConfig: ITokensConfig;
  constructor(
    private readonly authorizeUserUseCase: AuthorizeUserUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly refreshTokensUseCase: RefreshTokensUseCase,
    private readonly configService: ConfigService,
  ) {
    this.tokensConfig = configService.getOrThrow<ITokensConfig>(
      ConfigNames.JWT,
    );
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.tokensConfig.refreshTokenReqKey, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
  }

  @Post('/login')
  @ApiResponse({ type: AuthResponseDTO })
  async authorize(
    @Body() dto: AuthDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new AuthorizeUserCommand({
      email: dto.email,
      password: dto.password,
    });

    const authResult = await this.authorizeUserUseCase.execute(command);
    res.cookie(
      this.tokensConfig.refreshTokenReqKey,
      authResult.tokens.refresh,
      {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: DAY * 30,
      },
    );

    return new AuthResponseDTO(authResult);
  }

  @Post('/register')
  @ApiResponse({ type: AuthResponseDTO })
  async register(
    @Body() dto: RegisterDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new RegisterUserCommand({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    const authResult = await this.registerUserUseCase.execute(command);
    res.cookie(
      this.tokensConfig.refreshTokenReqKey,
      authResult.tokens.refresh,
      {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: DAY * 30,
      },
    );

    return new AuthResponseDTO(authResult);
  }

  @Post('/refresh')
  @ApiResponse({ type: TokensResponseDTO })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new RefreshTokensCommand({
      refreshToken: request.cookies[this.tokensConfig.refreshTokenReqKey],
    });

    const tokens = await this.refreshTokensUseCase.execute(command);

    res.cookie(this.tokensConfig.refreshTokenReqKey, tokens.refresh, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: DAY * 30,
    });

    return new TokensResponseDTO(tokens);
  }
}
