import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from 'src/categories/dto/create.dto';
import { UpdateCategoryDto } from 'src/categories/dto/update.dto';
import { CategoryEntity } from './entities/category.entity';
import { CategoriesCloneHelper } from 'src/categories/categories-clone.helper';
import { Category } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private readonly categoriesCloneHelper: CategoriesCloneHelper,
  ) {}

  /**
   * Creates a new category.
   * @param data The data for creating the category.
   * @returns A promise that resolves to the created category entity.
   */
  async create(data: CreateCategoryDto): Promise<CategoryEntity> {
    return this.prisma.category.create({
      data,
    });
  }

  /**
   * Retrieves a list of categories by test ID.
   * @param testId - The ID of the test.
   * @returns A promise that resolves to an array of CategoryEntity objects.
   */
  async findListByTestId(testId: string): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({
      where: {
        testId,
      },
      include: {
        questions: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  /**
   * Retrieves a category by its ID.
   * @param id - The ID of the category to retrieve.
   * @returns A Promise that resolves to the CategoryEntity object.
   */
  async findOne(id: string): Promise<CategoryEntity> {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        test: true,
        questions: true,
      },
    });
  }

  /**
   * Updates a category by its ID.
   * @param id - The ID of the category to update.
   * @param data - The updated category data.
   * @returns A promise that resolves to the updated category entity.
   */
  async updateOne(
    id: string,
    data: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.prisma.category.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * Deletes a category.
   * @param category The category to delete.
   */
  async deleteOne(category: Category): Promise<void> {
    this.prisma.$transaction(async (tx) => {
      await tx.category.delete({
        where: {
          id: category.id,
        },
      });

      await this.decremntOrderTx(tx, category);
    });
  }

  /**
   * Clones categories to a test.
   *
   * @param categories - The categories to clone.
   * @param testId - The ID of the test.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of cloned CategoryEntity objects.
   */
  async cloneCategoriesToTest(
    categories: CategoryEntity[],
    testId: string,
    userId: string,
  ): Promise<CategoryEntity[]> {
    const list = this.categoriesCloneHelper.parseCategories(
      categories,
      testId,
      userId,
    );

    const result = await this.prisma.$transaction(async (tx) => {
      for await (const item of list) {
        const { questions, ...data } = item;
        await tx.category.create({ data });

        for await (const question of questions) {
          await tx.question.create({ data: question });
        }
      }

      return [];
    });

    return result as unknown as CategoryEntity[];
  }

  async changeOrder(category: CategoryEntity, newOrder: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.category.updateMany({
        where: {
          testId: category.testId,
          order: newOrder,
        },
        data: { order: category.order },
      }),
      this.prisma.category.update({
        where: { id: category.id },
        data: { order: newOrder },
      }),
    ]);
  }

  async decremntOrderTx(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    category: CategoryEntity,
  ): Promise<void> {
    await tx.category.updateMany({
      where: {
        testId: category.testId,
        order: {
          gte: category.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });
  }

  async findLastByTestId(testId: string): Promise<Category> {
    return await this.prisma.category.findFirst({
      where: {
        testId,
      },
      orderBy: {
        order: 'desc',
      },
    });
  }
}
