import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInterviewDto } from 'src/interviews/dto/create.dto';
import { UpdateInterviewDto } from 'src/interviews/dto/update.dto';
import {
  PaginationQuery,
  PaginationResponse,
} from 'src/utils/models/pagination';
import { $Enums, Interview } from '@prisma/client';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, userId: string) {
    return await this.prisma.interview.findFirst({
      where: { id, userId },
      include: {
        candidate: true,
      },
    });
  }

  async findList(
    userId: string,
    query: PaginationQuery,
  ): Promise<PaginationResponse<Interview>> {
    const { take = 10, skip = 0, order, orderBy, search } = query;
    const searchParams = {
      where: {
        userId,
        name: {
          contains: search,
        },
      },
      take,
      skip,
    };
    const [total, list] = await this.prisma.$transaction([
      this.prisma.interview.count(searchParams),
      this.prisma.interview.findMany({
        ...searchParams,
        include: {
          candidate: true,
        },
        orderBy: {
          [orderBy]: order,
        },
      }),
    ]);

    return { list, total };
  }

  async create(data: CreateInterviewDto, userId: string) {
    return await this.prisma.interview.create({
      data: { ...data, userId, status: $Enums.InteviewStatus.CREATED },
    });
  }

  async updateById(data: UpdateInterviewDto, id: string, userId: string) {
    return await this.prisma.interview.update({
      where: { id, userId },
      data,
    });
  }

  async deleteById(id: string, userId: string) {
    return await this.prisma.interview.delete({
      where: { id, userId },
    });
  }

  async findIterviewTest(id: string, userId: string) {
    return await this.prisma.interview.findFirst({
      where: { id, userId },
      include: {
        test: {
          include: {
            categories: {
              include: {
                questions: true,
              },
            },
          },
        },
      },
    });
  }
}
