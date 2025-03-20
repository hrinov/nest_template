import { ethers, hashMessage } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ConfigNames } from 'src/common/types/config-names.enum';
import { ITokensConfig } from 'src/common/configs/tokens.config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async validateSignature(
    address: string,
    signature: string,
  ): Promise<boolean> {
    const jwtConfig = this.configService.getOrThrow<ITokensConfig>(
      ConfigNames.JWT,
    );
    try {
      const signer = ethers.recoverAddress(
        hashMessage(jwtConfig.authSignMessage),
        signature,
      );
      return address === signer;
    } catch {
      return false;
    }
  }
}
