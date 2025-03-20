import { ApiProperty } from '@nestjs/swagger';
import { TAuthResult } from '../types/auth';
import { TokensResponseDTO } from '../../tokens/dto/tokens.dto';
import { UserResponseDTO } from '../../users/dto/user-response.dto';

export class AuthResponseDTO {
  @ApiProperty({ type: TokensResponseDTO })
  tokens: TokensResponseDTO;

  @ApiProperty({ type: UserResponseDTO })
  user: UserResponseDTO;

  constructor({ tokens, user }: TAuthResult) {
    this.tokens = new TokensResponseDTO(tokens);
    this.user = new UserResponseDTO(user);
  }
}
