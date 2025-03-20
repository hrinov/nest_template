import { ConfigNames } from 'src/common/types/config-names.enum';
import { ConfigService } from '@nestjs/config';
import { ITokensConfig } from 'src/common/configs/tokens.config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TTokensPair } from './types/tokens';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class TokensService {
  private config: ITokensConfig;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.config = configService.getOrThrow(ConfigNames.JWT);
  }

  async generateJwtPair<T extends object = UserEntity>(
    user: T,
  ): Promise<TTokensPair> {
    const access = await this.generateAccessJwt(user);
    const refresh = await this.generateRefreshJwt(user);
    return {
      access,
      refresh,
    };
  }

  async generateAccessJwt<T extends object = UserEntity>(
    user: T,
  ): Promise<string> {
    const secret = this.config.accessSecret;
    const expiresIn = this.config.accessExpiresIn;
    return await this.jwtService.signAsync({ ...user }, { secret, expiresIn });
  }

  async generateRefreshJwt<T extends object = UserEntity>(
    user: T,
  ): Promise<string> {
    const secret = this.config.refreshSecret;
    const expiresIn = this.config.refreshExpiresIn;
    return await this.jwtService.signAsync({ ...user }, { secret, expiresIn });
  }

  async verifyAccessJwt<T extends object>(token: string): Promise<T | null> {
    try {
      const secret = this.config.accessSecret;
      const payload = await this.jwtService.verifyAsync<T>(token, { secret });
      return payload;
    } catch {
      return null;
    }
  }

  async verifyRefreshJwt<T extends object>(token: string): Promise<T | null> {
    try {
      const secret = this.config.refreshSecret;
      const payload = await this.jwtService.verifyAsync(token, { secret });
      return payload;
    } catch {
      return null;
    }
  }
}
