import { PartialType } from '@nestjs/swagger';
import { CreateTestDto } from './create.dto';

export class UpdateTestDto extends PartialType(CreateTestDto) {}
