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

@Controller('tests')
@UseGuards(JwtAuthGuard)
export class TestsController {
  constructor(private readonly service: TestsService) {}

  @Post()
  async create(@Auth() user: UserEntity, @Body() body: CreateTestDto) {
    return await this.service.create(body, user.id);
  }

  @Get()
  async findList(@Auth() user: UserEntity, @Query() query: PaginationQuery) {
    return await this.service.findList(user.id, query);
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
