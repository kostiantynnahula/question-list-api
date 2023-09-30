import { ApiProperty } from '@nestjs/swagger';
import { ResetPassword } from '@prisma/client';

export class ResetPasswordEntity implements ResetPassword {
  constructor(partial: Partial<ResetPasswordEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;
}
