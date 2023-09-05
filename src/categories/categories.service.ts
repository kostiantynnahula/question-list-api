import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, PrismaPromise } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import { CategoryDto } from 'src/tests/dto/category.dto';
import { CategoryEntity } from './entities/category.entity';
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async updateManyTx(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    categories: CategoryDto[],
    testId: string,
  ) {
    const existedCategories = [];
    const newCategories = [];

    const testCategoriesIds = (await this.findListByTestTx(tx, testId)).map(
      (category) => category.id,
    );

    categories.forEach((category) => {
      category.id
        ? existedCategories.push(category)
        : newCategories.push(category);
    });

    const existedCategoriesIds = existedCategories.map(
      (category) => category.id,
    );

    const deleteCategoriesIds = testCategoriesIds.filter(
      (id) => !existedCategoriesIds.includes(id),
    );

    for await (const category of existedCategories) {
      await this.updateOneTx(tx, category);
    }

    await this.createManyTx(tx, newCategories, testId);

    await this.deletManyTx(tx, deleteCategoriesIds);
  }

  async updateOneTx(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    { id, name }: CategoryDto,
  ) {
    await tx.category.update({
      data: { name },
      where: { id },
    });
  }

  async findListByTestTx(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    testId: string,
  ): Promise<PrismaPromise<Omit<CategoryEntity, 'questions'>[]>> {
    const result = await tx.category.findMany({
      where: { testId },
    });

    return result;
  }

  async createManyTx(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    categories: CategoryDto[],
    testId: string,
  ) {
    for await (const category of categories) {
      await tx.category.create({
        data: {
          name: category.name,
          questions: {
            create: category.questions,
          },
          test: {
            connect: {
              id: testId,
            },
          },
        },
      });
    }
  }

  async deletManyTx(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    ids: string[],
  ) {
    return await tx.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
