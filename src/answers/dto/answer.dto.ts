import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class AnswerDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  correct: boolean;
}
