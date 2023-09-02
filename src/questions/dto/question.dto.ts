import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class QuestionDto {
  @ApiProperty()
  @IsDefined()
  name: string;

  @ApiProperty()
  @IsDefined()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  createdAt: Date;
}
