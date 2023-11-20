import {
  Controller,
  UseGuards,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { TestsService } from 'src/tests/tests.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly testsService: TestsService,
  ) {}

  @Post()
  async create(@Auth() user: UserEntity, @Body() body) {
    const test = await this.testsService.findOne(body.testId, user.id);

    if (!test) {
      throw new NotFoundException();
    }

    return await this.categoriesService.create(body);
  }

  @Get(':id')
  async findOne(@Auth() user: UserEntity, @Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    if (category.test.userId !== user.id) {
      throw new NotFoundException();
    }

    return category;
  }

  @Patch(':id')
  async updateOne(
    @Auth() user: UserEntity,
    @Param('id') id: string,
    @Body() body,
  ) {
    const category = await this.categoriesService.findOne(id);
    if (category.test.userId !== user.id) {
      throw new NotFoundException();
    }

    return await this.categoriesService.updateOne(id, body);
  }

  @Delete(':id')
  async deleteOne(@Auth() user: UserEntity, @Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    if (category.test.userId !== user.id) {
      throw new NotFoundException();
    }

    return await this.categoriesService.deleteOne(id);
  }
}
