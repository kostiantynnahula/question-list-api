import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { QuestionsService } from 'src/questions/questions.service';

@Module({
  imports: [PrismaModule, QuestionsModule],
  providers: [CategoriesService, QuestionsService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
