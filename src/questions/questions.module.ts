import { Module, forwardRef } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuestionsController } from './questions.controller';
import { TestsModule } from 'src/tests/tests.module';
import { TestsService } from 'src/tests/tests.service';

@Module({
  imports: [PrismaModule, forwardRef(() => TestsModule)],
  providers: [QuestionsService, TestsService],
  exports: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
