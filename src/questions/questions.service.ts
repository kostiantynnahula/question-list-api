import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Question } from '@prisma/client';
import { CreateQuestionDto } from 'src/questions/dto/create.dto';
import { UpdateQuestionDto } from 'src/questions/dto/update.dto';
@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateQuestionDto & { userId: string },
  ): Promise<Question> {
    const [result] = await this.prisma.$transaction([
      this.prisma.question.create({ data }),
      this.prisma.question.updateMany({
        data: {
          order: {
            increment: 1,
          },
        },
        where: {
          testId: data.testId,
          order: { gte: data.order },
        },
      }),
    ]);

    return result;
  }

  async update(
    id: string,
    data: UpdateQuestionDto & { userId: string },
  ): Promise<Question> {
    const [result] = await this.prisma.$transaction([
      this.prisma.question.update({
        where: { id },
        data,
      }),
      this.prisma.question.updateMany({
        data: {
          order: {
            increment: 1,
          },
        },
        where: {
          testId: data.testId,
          order: { gte: data.order },
        },
      }),
    ]);

    return result;
  }

  async deleteById(id: string) {
    return this.prisma.question.delete({
      where: { id },
    });
  }

  async findListByTestId(testId: string): Promise<Question[]> {
    return this.prisma.question.findMany({
      where: {
        testId,
      },
    });
  }

  async findOne(id: string): Promise<Question> {
    return await this.prisma.question.findFirst({
      where: { id },
    });
  }

  async findIdsByTestId(testId: string): Promise<string[]> {
    const questions = await this.prisma.question.findMany({
      where: {
        testId,
      },
      select: {
        id: true,
      },
    });

    return questions.map((question) => question.id);
  }
}
