import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class CloneTestDto {
  @ApiProperty()
  @IsDefined()
  templateId: string;
}
