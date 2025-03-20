import { BadRequestException, HttpStatus } from '@nestjs/common';
import { AppHttpException } from './app-http.exception';

export class CustomBadRequestException extends AppHttpException {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, BadRequestException.name, message);
  }
}
