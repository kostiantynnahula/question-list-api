import { Injectable } from '@nestjs/common';
import { CandidateEntity } from 'src/candidates/entities/candidate.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCandidateDto } from 'src/candidates/dto/create.dto';
import { UpdateCandidateDto } from 'src/candidates/dto/update.dto';
import {
  PaginationQuery,
  PaginationResponse,
} from 'src/utils/models/pagination';
import { Candidate } from '@prisma/client';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, userId: string): Promise<CandidateEntity> {
    return this.prisma.candidate.findUnique({ where: { id, userId } });
  }

  async findList(
    userId: string,
    query: PaginationQuery,
  ): Promise<PaginationResponse<Candidate>> {
    const {
      take = 10,
      skip = 0,
      order = 'desc',
      orderBy = 'createdAt',
      search = '',
    } = query;

    const searchParams = {
      where: {
        userId,
        OR: [
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
        ],
      },
      take: Number(take),
      skip: Number(skip),
    };

    const [total, list] = await this.prisma.$transaction([
      this.prisma.candidate.count(searchParams),
      this.prisma.candidate.findMany({
        ...searchParams,
        orderBy: {
          [orderBy]: order,
        },
      }),
    ]);

    return { list, total };
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
