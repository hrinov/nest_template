import { HttpStatus } from '@nestjs/common';
import { AppHttpException } from './app-http.exception';

export class InvalidAccessTokenException extends AppHttpException {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      InvalidAccessTokenException.name,
      'Invalid access token',
    );
  }
}
