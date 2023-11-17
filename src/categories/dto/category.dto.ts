import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
// import { QuestionDto } from 'src/questions/dto/question.dto';

export class CategoryDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => QuestionDto)
  // questions: QuestionDto[];
}
