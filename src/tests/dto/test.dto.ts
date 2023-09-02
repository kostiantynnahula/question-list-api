import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { CategoryDto } from 'src/categories/dto/category.dto';

export class TestDto {
  @ApiProperty()
  @IsDefined()
  name: string;

  @ApiProperty()
  @IsDefined()
  user: number;

  @ApiProperty()
  @IsDefined()
  category: CategoryDto;

  @ApiProperty()
  createdAt: Date;
}
