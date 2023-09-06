import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
