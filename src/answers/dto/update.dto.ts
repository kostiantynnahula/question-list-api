import { PartialType } from '@nestjs/swagger';
import { CreateAnswerDto } from './create.dto';

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {}
