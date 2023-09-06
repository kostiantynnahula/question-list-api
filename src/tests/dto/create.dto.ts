import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { CategoryDto } from 'src/categories/dto/category.dto';

export class CreateTestDto {
  @ApiProperty()
  @IsDefined()
  name: string;

  @ApiProperty()
  @IsDefined()
  categories: CategoryDto[];

  @ApiProperty()
  createdAt: Date;
}
