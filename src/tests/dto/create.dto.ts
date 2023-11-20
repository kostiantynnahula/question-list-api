import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined } from 'class-validator';

export class CreateTestDto {
  @ApiProperty()
  @IsDefined()
  name: string;

  @ApiPropertyOptional()
  @IsBoolean()
  isTemplate: boolean;

  @ApiProperty()
  createdAt: Date;
}
