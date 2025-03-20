import { HttpStatus } from '@nestjs/common';
import { AppHttpException } from './app-http.exception';

export class InvalidRefreshTokenException extends AppHttpException {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      InvalidRefreshTokenException.name,
      'Invalid refresh token',
    );
  }
}
