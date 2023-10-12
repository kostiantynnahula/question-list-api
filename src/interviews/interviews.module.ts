import { Module } from '@nestjs/common';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { AnswersService } from 'src/answers/answers.service';

@Module({
  imports: [PrismaModule, QuestionsModule],
  controllers: [InterviewsController],
  providers: [InterviewsService, AnswersService],
  exports: [InterviewsService],
})
export class InterviewsModule {}
