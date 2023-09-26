import { ApiProperty } from '@nestjs/swagger';
import { Interview } from '@prisma/client';

export class InterviewEntity implements Interview {
  constructor(partial: Partial<InterviewEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  testId: string;

  @ApiProperty()
  candidateId: string;

  @ApiProperty()
  createdAt: Date;
}
