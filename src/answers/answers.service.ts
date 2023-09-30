import { Injectable } from '@nestjs/common';
import { AnswerEntity } from 'src/answers/answer.entity';
import { CreateAnswerDto } from 'src/answers/dto/create.dto';
import { UpdateAnswerDto } from 'src/answers/dto/update.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnswersService {
  constructor(private prisma: PrismaService) {}

  findList(id: string, userId: string): Promise<Array<AnswerEntity>> {
    return this.prisma.answer.findMany({
      where: {
        interviewId: id,
        interview: {
          userId,
        },
      },
    });
  }

  findOne(id: string, userId: string): Promise<AnswerEntity> {
    return this.prisma.answer.findFirst({
      where: {
        id,
        interview: { userId },
      },
    });
  }

  createOne(data: CreateAnswerDto): Promise<AnswerEntity> {
    return this.prisma.answer.create({ data });
  }

  updateOne(
    id: string,
    data: UpdateAnswerDto,
    userId: string,
  ): Promise<AnswerEntity> {
    return this.prisma.answer.update({
      data,
      where: { id, interview: { userId } },
    });
  }
}
