import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { QuestionDto } from './question.dto';

export class CategoryDto {
  @ApiPropertyOptional()
  id: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  questions: QuestionDto[];
}
