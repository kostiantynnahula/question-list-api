import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestDto } from 'src/tests/dto/create.dto';
import { UpdateTestDto } from 'src/tests/dto/update.dto';
import { TestPaginationQuery as PaginationQuery } from './models';
import { PaginationResponse } from 'src/utils/models/pagination';
import { Test } from '@prisma/client';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new test.
   * @param data - The data for the test.
   * @param userId - The ID of the user creating the test.
   * @returns A Promise that resolves to the created test.
   */
  async create(data: CreateTestDto, userId: string): Promise<Test> {
    return await this.prisma.test.create({
      data: {
        name: data.name,
        userId,
      },
    });
  }

  /**
   * Finds a list of tests based on the provided parameters.
   * 
   * @param userId - The ID of the user.
   * @param query - The pagination query parameters.
   * @returns A promise that resolves to a pagination response containing the list of tests and the total count.
   */
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

  /**
   * Finds a list of tests by user ID.
   * 
   * @param userId - The ID of the user.
   * @param isTemplate - Optional. Specifies whether to include template tests. Default is false.
   * @returns A promise that resolves to an array of Test objects.
   */
  async findListByUserId(userId: string, isTemplate = false): Promise<Test[]> {
    return this.prisma.test.findMany({
      where: {
        userId,
        isTemplate,
      },
    });
  }

  /**
   * Finds a test by its ID and user ID.
   * @param id - The ID of the test.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the found test.
   */
  async findOne(id: string, userId: string): Promise<Test> {
    return this.prisma.test.findFirst({
      where: { id, userId },
      include: {
        categories: {
          include: {
            questions: true,
          },
        },
        questions: true,
      },
    });
  }

  /**
   * Updates a test with the specified ID.
   * @param id - The ID of the test to update.
   * @param data - The data to update the test with.
   * @returns A promise that resolves to the updated test.
   */
  async updateOne(id: string, data: UpdateTestDto): Promise<Test> {
    return this.prisma.test.update({
      data: {
        name: data.name,
      },
      where: { id },
    });
  }

  /**
   * Deletes a test with the specified ID and user ID.
   * @param id - The ID of the test to delete.
   * @param userId - The ID of the user who owns the test.
   * @returns A promise that resolves to the deleted test.
   */
  async deleteOne(id: string, userId: string): Promise<Test> {
    return this.prisma.test.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
