import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';

export class ForgotDto {
  @ApiProperty()
  @IsDefined()
  @IsEmail()
  email: string;
}
