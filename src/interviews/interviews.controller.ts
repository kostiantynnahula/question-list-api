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
import { QuestionsService } from 'src/questions/questions.service';
import { AnswersService } from 'src/answers/answers.service';
import { $Enums } from '@prisma/client';
@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(
    private readonly service: InterviewsService,
    private readonly questionsService: QuestionsService,
    private readonly answersService: AnswersService,
  ) {}

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

  @Get(':id/test')
  async findTestByInterviewId(
    @Auth() user: UserEntity,
    @Param('id') id: string,
  ) {
    return await this.service.findIterviewTest(id, user.id);
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

  @Post(':id/start')
  async start(@Auth() user: UserEntity, @Param('id') id: string) {
    const interview = await this.service.findById(id, user.id);
    if (interview.status === $Enums.InteviewStatus.STARTED) {
      return interview;
    }
    const ids = await this.questionsService.findIdsByInterviewId(
      interview.testId,
    );
    const answersData = ids.map((questionId) => ({
      questionId,
      interviewId: id,
    }));

    await this.answersService.createEmptyAnswers(answersData);

    await this.service.updateById(
      { status: $Enums.InteviewStatus.STARTED },
      id,
      user.id,
    );

    return { ...interview, status: $Enums.InteviewStatus.STARTED };
  }

  @Get(':id/answers')
  async answers(
    @Auth() user: UserEntity,
    @Param('id') id: string,
    @Query('extended') extended: boolean,
  ) {
    if (extended) {
      return await this.answersService.findExtendedList(id, user.id);
    }
    return await this.answersService.findList(id, user.id);
  }
}
