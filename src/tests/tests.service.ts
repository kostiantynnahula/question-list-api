import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestDto } from 'src/tests/dto/create.dto';
import { UpdateTestDto } from 'src/tests/dto/update.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class TestsService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoriesService,
  ) {}

  async create(data: CreateTestDto, userId: number) {
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

  async findList(userId: number) {
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
    });
  }

  async findOne(id: string, userId: number) {
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

  async deleteOne(id: string, userId: number) {
    return await this.prisma.test.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
