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
    if (data.categoryId !== question.categoryId) {
      const lastQuestion = await this.findLastQuestionByCategoryId(
        data.categoryId,
        question.testId,
      );
      data.order = lastQuestion ? lastQuestion.order + 1 : 0;
    }

    const [, result] = await this.prisma.$transaction([
      this.prisma.question.updateMany({
        where: {
          order: {
            gt: question.order,
          },
          categoryId: question.categoryId,
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      }),
      this.prisma.question.update({
        where: { id: question.id },
        data,
      }),
    ]);

    return result;
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
    const order =
      question.order > newOrder ? question.order - 1 : question.order + 1;

    await this.prisma.$transaction([
      this.prisma.question.updateMany({
        where: {
          testId: question.testId,
          order: order,
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
