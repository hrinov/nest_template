import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RecoverPasswordDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S*$/, {
    message: 'Password should not contain spaces',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
