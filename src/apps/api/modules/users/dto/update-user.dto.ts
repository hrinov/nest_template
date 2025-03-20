import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;
}
