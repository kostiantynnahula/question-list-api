import { Module, forwardRef } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesController } from './categories.controller';
import { TestsModule } from 'src/tests/tests.module';
import { TestsService } from 'src/tests/tests.service';

@Module({
  imports: [PrismaModule, forwardRef(() => TestsModule)],
  providers: [CategoriesService, TestsService],
  exports: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
