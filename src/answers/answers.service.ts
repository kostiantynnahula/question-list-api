import { Injectable } from '@nestjs/common';
import { AnswerEntity } from 'src/answers/answer.entity';
import { AnswerDto } from 'src/answers/dto/answer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnswersService {
  constructor(private prisma: PrismaService) {}

  async findList(
    interviewId: string,
    userId: string,
  ): Promise<Array<AnswerEntity>> {
    return await this.prisma.answer.findMany({
      where: {
        interviewId,
        interview: {
          userId,
        },
      },
    });
  }

  async findOne(id: string, userId: string): Promise<AnswerEntity> {
    return await this.prisma.answer.findFirst({
      where: {
        id,
        interview: { userId },
      },
    });
  }

  async updateOne(
    id: string,
    data: AnswerDto,
    userId: string,
  ): Promise<AnswerEntity> {
    const { correct } = data;

    return this.prisma.answer.update({
      data: { correct },
      where: { id, interview: { userId } },
    });
  }

  async createEmptyAnswers(
    data: Array<Pick<AnswerEntity, 'questionId' | 'interviewId'>>,
  ) {
    return await this.prisma.answer.createMany({ data });
  }
}
