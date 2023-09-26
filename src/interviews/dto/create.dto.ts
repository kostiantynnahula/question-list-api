import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateInterviewDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  testId: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  candidateId: string;
}
