import { ApiProperty } from '@nestjs/swagger';
import { Test } from '@prisma/client';
import { CategoryEntity } from 'src/categories/entities/category.entity';

export class TestEntity implements Test {
  constructor(partial: Partial<TestEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  categories: CategoryEntity[];

  @ApiProperty()
  isTemplate: boolean;

  @ApiProperty()
  createdAt: Date;
}
