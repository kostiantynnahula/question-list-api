import { PartialType } from '@nestjs/swagger';
import { CreateCandidateDto } from './create.dto';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {}
