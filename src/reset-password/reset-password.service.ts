import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResetPasswordDto } from './dto/create.dto';

@Injectable()
export class ResetPasswordService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateResetPasswordDto) {
    return this.prisma.resetPassword.create({ data });
  }

  async findByEmail(email: string) {
    return this.prisma.resetPassword.findFirst({ where: { email } });
  }

  async findByToken(token: string) {
    return this.prisma.resetPassword.findFirst({ where: { token } });
  }

  async deleteById(id: string): Promise<void> {
    this.prisma.resetPassword.delete({ where: { id } });
  }
}
