import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateInterviewDto } from 'src/interviews/dto/create.dto';
import { IsOptional } from 'class-validator';
import { $Enums } from '@prisma/client';

export class UpdateInterviewDto extends PartialType(CreateInterviewDto) {
  @ApiProperty()
  @IsOptional()
  status: $Enums.InteviewStatus;
}
