import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestDto } from 'src/tests/dto/create.dto';
import { UpdateTestDto } from 'src/tests/dto/update.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { TestPaginationQuery as PaginationQuery } from './models';
import { PaginationResponse } from 'src/utils/models/pagination';
import { Test } from '@prisma/client';

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

  async findList(
    userId: string,
    query: PaginationQuery,
  ): Promise<PaginationResponse<Test>> {
    const {
      take = 10,
      skip = 0,
      order = 'desc',
      orderBy = 'createdAt',
      search = '',
    } = query;

    const isTemplate = query.isTemplate ? Boolean(query.isTemplate) : undefined;

    const searchParams = {
      where: {
        userId,
        isTemplate,
        name: {
          contains: search,
        },
      },
    };

    const [total, list] = await this.prisma.$transaction([
      this.prisma.test.count(searchParams),
      this.prisma.test.findMany({
        ...searchParams,
        include: {
          categories: {
            include: {
              questions: true,
            },
          },
        },
        orderBy: {
          [orderBy]: order,
        },
        skip: Number(skip),
        take: Number(take),
      }),
    ]);

    return { list, total };
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
