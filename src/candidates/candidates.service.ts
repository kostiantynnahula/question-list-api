import { Injectable } from '@nestjs/common';
import { CandidateEntity } from 'src/candidates/entities/candidate.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCandidateDto } from 'src/candidates/dto/create.dto';
import { UpdateCandidateDto } from 'src/candidates/dto/update.dto';
import { PaginationQuery } from 'src/utils/models/pagination';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, userId: string): Promise<CandidateEntity> {
    return this.prisma.candidate.findUnique({ where: { id, userId } });
  }

  async findList(userId: string, query: PaginationQuery) {
    const {
      take = 10,
      skip = 0,
      order = 'desc',
      orderBy = 'createdAt',
      search = '',
    } = query;

    const where: Record<string, any> = { userId };

    if (search.length) {
      where.OR = [
        {
          email: {
            contains: search,
          },
        },
        {
          fullName: {
            contains: search,
          },
        },
      ];
    }

    return this.prisma.candidate.findMany({
      where,
      take: Number(take),
      skip: Number(skip),
      orderBy: {
        [orderBy]: order,
      },
    });
  }

  async updateById(id: string, data: UpdateCandidateDto, userId: string) {
    return this.prisma.candidate.update({
      where: { id, userId },
      data,
    });
  }

  async create(data: CreateCandidateDto, userId: string) {
    return this.prisma.candidate.create({ data: { ...data, userId } });
  }

  async deleteById(id: string, userId: string) {
    return this.prisma.candidate.delete({ where: { id, userId } });
  }
}
