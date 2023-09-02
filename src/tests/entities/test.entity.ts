import { ApiProperty } from '@nestjs/swagger';
import { Test } from '@prisma/client';

export class TestEntity implements Test {
  constructor(partial: Partial<TestEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;
}
