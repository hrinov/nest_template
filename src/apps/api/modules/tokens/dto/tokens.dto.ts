import { ApiProperty } from '@nestjs/swagger';
import { TTokensPair } from '../types/tokens';

export class TokensResponseDTO {
  @ApiProperty()
  access: string;

  constructor(params: TTokensPair) {
    this.access = params.access;
  }
}
