import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { InterviewsModule } from 'src/interviews/interviews.module';

@Module({
  imports: [PrismaModule, InterviewsModule],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
