import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { QuestionEntity } from 'src/questions/entities/question.entity';

export class CategoryEntity implements Category {
  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  testId: string;

  @ApiProperty()
  questions: QuestionEntity[];

  @ApiProperty()
  order: number;

  @ApiProperty()
  createdAt: Date;
}
