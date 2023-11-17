import { ApiProperty } from '@nestjs/swagger';
import { Question, User } from '@prisma/client';

export class QuestionEntity implements Question {
  constructor(partial: Partial<QuestionEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  categoryId: string | null;

  @ApiProperty()
  order: number;

  @ApiProperty()
  testId: string;

  @ApiProperty()
  userId: string | null;

  @ApiProperty()
  createdAt: Date;
}
