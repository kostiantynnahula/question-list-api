import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { EmailValidator } from 'src/auth/validator/email.validator';

export class RegisterDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  @Validate(EmailValidator)
  email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;
}
