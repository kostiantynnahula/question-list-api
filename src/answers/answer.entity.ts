import { ApiProperty } from '@nestjs/swagger';
import { Answer } from '@prisma/client';

export class AnswerEntity implements Answer {
  constructor(partial: Partial<AnswerEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  questionId: string;

  @ApiProperty()
  interviewId: string;

  @ApiProperty()
  correct: boolean | null = null;

  @ApiProperty()
  createdAt: Date;
}
