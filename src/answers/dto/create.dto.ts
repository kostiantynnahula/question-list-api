import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  questionId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  interviewId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  correct: boolean;
}
