import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInterviewDto } from 'src/interviews/dto/create.dto';
import { UpdateInterviewDto } from 'src/interviews/dto/update.dto';
import { PaginationQuery } from 'src/utils/models/pagination';
import { $Enums } from '@prisma/client';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, userId: string) {
    return await this.prisma.interview.findFirst({
      where: { id, userId },
    });
  }

  async findList(userId: string, pagination: PaginationQuery) {
    const { take = 10, skip = 0 } = pagination;
    return await this.prisma.interview.findMany({
      where: {
        userId,
      },
      take,
      skip,
    });
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
}
