import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateQuestionDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId: string;

  @ApiPropertyOptional()
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  testId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  order: number;

  @ApiProperty()
  createdAt: Date;
}
