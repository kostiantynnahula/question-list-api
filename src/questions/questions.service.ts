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
    const result = this.prisma.question.create({ data });

    return result;
  }

  async update(question: Question, data: UpdateQuestionDto): Promise<Question> {
    return this.prisma.question.update({
      where: { id: question.id },
      data,
    });
  }

  async findLastQuestionByCategoryId(
    categoryId: string,
    testId: string,
  ): Promise<Question> {
    const result = await this.prisma.question.findFirst({
      where: {
        categoryId,
        testId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    return result;
  }

  async changeOrder(question: Question, newOrder: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.question.updateMany({
        where: {
          testId: question.testId,
          order: newOrder,
          categoryId: question.categoryId,
        },
        data: { order: question.order },
      }),
      this.prisma.question.update({
        where: { id: question.id },
        data: { order: newOrder },
      }),
    ]);
  }

  async decrementOrder(order: number, categoryId: string) {
    await this.prisma.question.updateMany({
      where: {
        order: {
          gte: order,
        },
        categoryId,
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });
  }

  async deleteQuestion({ id, categoryId, order }: Question) {
    await this.prisma.$transaction([
      this.prisma.question.delete({
        where: { id },
      }),
      this.prisma.question.updateMany({
        where: {
          order: {
            gte: order,
          },
          categoryId,
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      }),
    ]);
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
