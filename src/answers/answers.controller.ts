import { Controller, Get, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AnswerDto } from 'src/answers/dto/answer.dto';
import { AnswersService } from 'src/answers/answers.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('answers')
@UseGuards(JwtAuthGuard)
export class AnswersController {
  constructor(private readonly service: AnswersService) {}

  @Get(':id')
  async findOne(@Auth() user: UserEntity, @Param('id') id: string) {
    return await this.service.findOne(id, user.id);
  }

  @Patch(':id')
  async update(
    @Auth() user: UserEntity,
    @Body() body: AnswerDto,
    @Param('id') id: string,
  ) {
    return await this.service.updateOne(id, body, user.id);
  }
}
