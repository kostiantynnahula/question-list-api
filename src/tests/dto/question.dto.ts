import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class QuestionDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiProperty()
  @IsDefined()
  @MaxLength(65)
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(255)
  description: string | null;

  @ApiProperty()
  @IsDefined()
  @MaxLength(255)
  @IsNotEmpty()
  answer: string;

  @ApiProperty()
  createdAt: Date;
}
