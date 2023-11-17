import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Patch,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateQuestionDto } from './dto/create.dto';
import { UpdateQuestionDto } from './dto/update.dto';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async createOne(@Auth() user: UserEntity, @Body() body: CreateQuestionDto) {
    return await this.questionsService.create({
      ...body,
      userId: user.id,
    });
  }

  @Get(':testId')
  async findByTestId(@Param('testId') testId: string) {
    return await this.questionsService.findListByTestId(testId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.questionsService.findOne(id);
  }

  @Delete(':id')
  async deleteOne(@Auth() user: UserEntity, @Param('id') id: string) {
    const question = await this.questionsService.findOne(id);

    if (question.userId !== user.id) {
      throw new NotFoundException();
    }

    return await this.questionsService.deleteById(id);
  }

  @Patch(':id')
  async updateOne(
    @Auth() user: UserEntity,
    @Param('id') id: string,
    @Body() body: UpdateQuestionDto,
  ) {
    const question = await this.questionsService.findOne(id);

    if (question.userId !== user.id) {
      throw new NotFoundException();
    }

    return await this.questionsService.update(id, { ...body, userId: user.id });
  }
}