import { ConfigNames } from '../types/config-names.enum';
import { registerAs } from '@nestjs/config';

export interface ITokensConfig {
  accessSecret: string;
  accessExpiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
  refreshTokenReqKey: string;
  authSignMessage: string;
}

export const tokensConfig = registerAs(ConfigNames.JWT, () => {
  const accessSecret = process.env.ACCESS_JWT_SECRET;
  const accessExpiresIn = process.env.ACCESS_JWT_EXPIRES_IN;
  const refreshSecret = process.env.REFRESH_JWT_SECRET;
  const refreshExpiresIn = process.env.REFRESH_JWT_EXPIRES_IN;
  const refreshTokenReqKey = process.env.REFRESH_TOKEN_REQ_KEY;
  const authSignMessage = process.env.AUTH_SIGN_MESSAGE;

  if (
    !accessSecret ||
    !accessExpiresIn ||
    !refreshSecret ||
    !refreshExpiresIn ||
    !refreshTokenReqKey
  ) {
    throw new Error('Invalid JWT tokens config');
  }
  const config: ITokensConfig = {
    accessSecret,
    accessExpiresIn,
    refreshSecret,
    refreshExpiresIn,
    refreshTokenReqKey,
    authSignMessage,
  };

  return config;
});
