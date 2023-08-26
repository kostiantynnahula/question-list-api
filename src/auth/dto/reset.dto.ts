import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class ResetDto {
  @ApiProperty()
  @IsDefined()
  token: string;

  @ApiProperty()
  @IsDefined()
  password: string;
}
