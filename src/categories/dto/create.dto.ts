import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  testId: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  order: number;
}
