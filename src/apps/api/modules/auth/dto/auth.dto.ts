import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class AuthDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S*$/, {
    message: 'Password should not contain spaces',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  password: string;
}

export class RefreshTokensDTO {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
