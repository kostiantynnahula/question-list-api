import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UseGuards,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateAnswerDto } from 'src/answers/dto/create.dto';
import { UpdateAnswerDto } from 'src/answers/dto/update.dto';
import { AnswersService } from 'src/answers/answers.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { InterviewsService } from 'src/interviews/interviews.service';
import { $Enums } from '@prisma/client';

@Controller('answers')
@UseGuards(JwtAuthGuard)
export class AnswersController {
  constructor(
    private readonly service: AnswersService,
    private readonly interviewService: InterviewsService,
  ) {}

  @Get(':id')
  async findOne(@Auth() user: UserEntity, @Param('id') id: string) {
    return await this.service.findOne(id, user.id);
  }

  @Get(':interviewId')
  async findList(@Auth() user: UserEntity, @Param('interviewId') id: string) {
    return await this.service.findList(id, user.id);
  }

  @Post()
  async create(@Auth() user: UserEntity, @Body() body: CreateAnswerDto) {
    const interview = await this.interviewService.findById(
      body.interviewId,
      user.id,
    );

    if (interview) {
      throw new BadRequestException('Interview is incorrect');
    }

    const result = await this.service.createOne(body);

    await this.interviewService.updateById(
      {
        status: $Enums.InteviewStatus.STARTED,
      },
      interview.id,
      user.id,
    );

    return result;
  }

  @Patch(':id')
  async update(
    @Auth() user: UserEntity,
    @Body() body: UpdateAnswerDto,
    @Param('id') id: string,
  ) {
    return await this.service.updateOne(id, body, user.id);
  }
}
