import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async updateMany(tx: Omit<PrismaClient, runtime.ITXClientDenyList>) {
    //
  }
}
