import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryDto } from 'src/categories/dto/category.dto';

export class CreateTestDto {
  @ApiProperty()
  @IsDefined()
  name: string;

  @ApiProperty()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  categories: CategoryDto[];

  @ApiPropertyOptional()
  @IsBoolean()
  isTemplate: boolean;

  @ApiProperty()
  createdAt: Date;
}
