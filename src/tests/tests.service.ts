import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestDto } from 'src/tests/dto/create.dto';
import { UpdateTestDto } from 'src/tests/dto/update.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { PaginationQuery } from 'src/utils/models/pagination';

@Injectable()
export class TestsService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoriesService,
  ) {}

  async create(data: CreateTestDto, userId: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const test = await tx.test.create({
        data: {
          name: data.name,
          userId,
        },
      });

      await this.categoryService.createManyTx(tx, data.categories, test.id);

      return test;
    });

    return result;
  }

  async findList(userId: string, query: PaginationQuery) {
    const { take = 10, skip = 0 } = query;
    return this.prisma.test.findMany({
      where: {
        userId,
      },
      include: {
        categories: {
          include: {
            questions: true,
          },
        },
      },
      take: Number(take),
      skip: Number(skip),
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.test.findFirst({
      where: { id, userId },
      include: {
        categories: {
          include: {
            questions: true,
          },
        },
      },
    });
  }

  async updateOne(id: string, data: UpdateTestDto) {
    return await this.prisma.$transaction(async (tx) => {
      if (data.name) {
        await tx.test.update({
          data: {
            name: data.name,
          },
          where: {
            id,
          },
        });
      }

      if (data.categories) {
        await this.categoryService.updateManyTx(tx, data.categories, id);
      }
    });
  }

  async deleteOne(id: string, userId: string) {
    return await this.prisma.test.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
