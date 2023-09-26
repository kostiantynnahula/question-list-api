import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInterviewDto } from 'src/interviews/dto/create.dto';
import { UpdateInterviewDto } from 'src/interviews/dto/update.dto';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    //
  }

  async findList() {
    //
  }

  async create(data: CreateInterviewDto) {
    //
  }

  async updateById(id: string, data: UpdateInterviewDto) {
    //
  }

  async deleteById(id: string) {
    //
  }
}
