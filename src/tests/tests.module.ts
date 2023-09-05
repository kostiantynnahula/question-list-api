import { Module } from '@nestjs/common';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  imports: [PrismaModule, CategoriesModule],
  controllers: [TestsController],
  providers: [TestsService, CategoriesService],
})
export class TestsModule {}
