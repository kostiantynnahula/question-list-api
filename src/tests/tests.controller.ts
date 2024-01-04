import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UseGuards,
  Patch,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateTestDto } from './dto/create.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateTestDto } from './dto/update.dto';
import { TestPaginationQuery as PaginationQuery } from './models';
import { CategoriesService } from 'src/categories/categories.service';
import { QuestionsService } from 'src/questions/questions.service';
import { CloneTestDto } from './dto/clone.dto';

@Controller('tests')
@UseGuards(JwtAuthGuard)
export class TestsController {
  constructor(
    private readonly service: TestsService,
    private readonly categoryService: CategoriesService,
  ) {}

  @Post()
  async create(@Auth() user: UserEntity, @Body() body: CreateTestDto) {
    return await this.service.create(body, user.id);
  }

  @Get()
  async findList(@Auth() user: UserEntity, @Query() query: PaginationQuery) {
    return await this.service.findList(user.id, query);
  }

  @Post(':id/clone')
  async cloneTemplate(
    @Auth() user: UserEntity,
    @Body() { templateId }: CloneTestDto,
    @Param('id') id: string,
  ) {
    const template = await this.service.findOne(templateId, user.id);

    const test = await this.service.findOneByUserId(id, user.id);

    if (!test) {
      throw new NotFoundException('The test was not found');
    }

    if (!template) {
      throw new NotFoundException('The template was not found');
    }

    const categories = await this.categoryService.findListByTestId(template.id);

    const result = await this.categoryService.cloneCategoriesToTest(
      categories,
      id,
      user.id,
    );

    return result;
  }

  @Get('list')
  async findTests(
    @Auth() user: UserEntity,
    @Query('isTemplate') isTemplate: boolean,
  ) {
    return await this.service.findListByUserId(user.id, isTemplate);
  }

  @Get(':id')
  async findOne(@Auth() user: UserEntity, @Param('id') id: string) {
    const test = await this.service.findOne(id, user.id);

    if (!test) {
      return new NotFoundException();
    }

    return test;
  }

  @Patch(':id')
  async updateOne(
    @Auth() user: UserEntity,
    @Param('id') id: string,
    @Body() body: UpdateTestDto,
  ) {
    const test = await this.service.findOne(id, user.id);

    if (!test) {
      throw new NotFoundException('The test was not found');
    }

    await this.service.updateOne(id, body);

    return await this.service.findOne(id, user.id);
  }

  @Delete(':id')
  async deleteOne(@Auth() user: UserEntity, @Param('id') id: string) {
    return await this.service.deleteOne(id, user.id);
  }
}
