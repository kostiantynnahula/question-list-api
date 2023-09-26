import {
  Controller,
  UseGuards,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { InterviewsService } from 'src/interviews/interviews.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateInterviewDto } from 'src/interviews/dto/create.dto';
import { UpdateInterviewDto } from 'src/interviews/dto/update.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { PaginationQuery } from 'src/utils/models/pagination';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly service: InterviewsService) {}

  @Get()
  async findList(@Auth() user: UserEntity, @Query() query: PaginationQuery) {
    return await this.service.findList(user.id, query);
  }

  @Get(':id')
  async findOne(@Auth() user: UserEntity, @Param('id') id: string) {
    const interview = await this.service.findById(id, user.id);
    if (!interview) {
      throw new NotFoundException();
    }
    return interview;
  }

  @Post()
  async create(@Auth() user: UserEntity, @Body() body: CreateInterviewDto) {
    return await this.service.create(body, user.id);
  }

  @Patch(':id')
  async update(
    @Auth() user: UserEntity,
    @Body() body: UpdateInterviewDto,
    @Param('id') id: string,
  ) {
    const interview = await this.service.findById(id, user.id);

    if (!interview) {
      throw new NotFoundException();
    }

    return await this.service.updateById(body, id, user.id);
  }

  @Delete(':id')
  async delete(@Auth() user: UserEntity, @Param('id') id: string) {
    const interview = await this.service.findById(id, user.id);

    if (!interview) {
      throw new NotFoundException();
    }

    return await this.service.deleteById(id, user.id);
  }
}
