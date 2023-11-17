import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuestionsController } from './questions.controller';

@Module({
  imports: [PrismaModule],
  providers: [QuestionsService],
  exports: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
