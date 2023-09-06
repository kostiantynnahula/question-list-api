import { Module } from '@nestjs/common';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';
import { QuestionsModule } from 'src/questions/questions.module';
import { QuestionsService } from 'src/questions/questions.service';

@Module({
  imports: [PrismaModule, CategoriesModule, QuestionsModule],
  controllers: [TestsController],
  providers: [TestsService, CategoriesService, QuestionsService],
})
export class TestsModule {}
