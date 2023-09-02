import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class CategoryDto {
  @ApiProperty()
  @IsDefined()
  name: string;

  @ApiProperty()
  @IsDefined()
  testId: string;

  @ApiProperty()
  createdAt: Date;
}
