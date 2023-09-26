import { Controller, UseGuards } from '@nestjs/common';
import { InterviewsService } from 'src/interviews/interviews.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly service: InterviewsService) {}
}
