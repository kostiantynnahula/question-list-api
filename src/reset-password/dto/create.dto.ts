import { ApiProperty } from '@nestjs/swagger';

export class CreateResetPasswordDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  userId: string;
}
