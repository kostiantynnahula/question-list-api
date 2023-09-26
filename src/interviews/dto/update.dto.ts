import { PartialType } from '@nestjs/swagger';
import { CreateInterviewDto } from 'src/interviews/dto/create.dto';

export class UpdateInterviewDto extends PartialType(CreateInterviewDto) {}
