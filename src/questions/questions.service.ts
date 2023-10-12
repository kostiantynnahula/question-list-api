import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import { QuestionDto } from 'src/questions/dto/question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async updateManyTx(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    questions: QuestionDto[],
    categoryId: string,
  ) {
    const existedQuestions = [];
    const newQuestions = [];

    const categoryQuestionsIds = (
      await this.findListByCategoryTx(tx, categoryId)
    ).map((question) => question.id);

    questions.forEach((question) => {
      question.id
        ? existedQuestions.push(question)
        : newQuestions.push(question);
    });

    const existedQuestionsIds = existedQuestions.map((question) => question.id);

    const deleteQuestionsIds = categoryQuestionsIds.filter(
      (id) => !existedQuestionsIds.includes(id),
    );

    for await (const question of existedQuestions) {
      await this.updateOneTx(tx, question);
    }

    await this.createManyTx(tx, newQuestions, categoryId);

    await this.deleteManyTx(tx, deleteQuestionsIds);
  }

  async findListByCategoryTx(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    categoryId: string,
  ) {
    const result = await tx.question.findMany({
      where: { categoryId },
    });

    return result;
  }

  async deleteManyTx(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    ids: string[],
  ) {
    return await tx.question.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async updateOneTx(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    question: QuestionDto,
  ) {
    return await tx.question.update({
      data: question,
      where: { id: question.id },
    });
  }

  async createManyTx(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    questions: QuestionDto[],
    categoryId: string,
  ) {
    for await (const question of questions) {
      await tx.question.create({
        data: {
          ...question,
          category: {
            connect: {
              id: categoryId,
            },
          },
        },
      });
    }
  }

  async findIdsByInterviewId(id: string): Promise<string[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        testId: id,
      },
      select: {
        questions: {
          select: {
            id: true,
          },
        },
      },
    });

    const ids: string[] = [];

    // TODO simplify it
    categories.forEach((category) => {
      const list = category.questions.map((q) => q.id);
      ids.push(...list);
    });

    return ids;
  }
}
