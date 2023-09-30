import { ApiProperty } from '@nestjs/swagger';
import { Candidate } from '@prisma/client';

export class CandidateEntity implements Candidate {
  constructor(partial: Partial<CandidateEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  resumeLink: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;
}
