import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UseGuards,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from 'src/candidates/dto/create.dto';
import { UpdateCandidateDto } from 'src/candidates/dto/update.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('candidates')
@UseGuards(JwtAuthGuard)
export class CandidatesController {
  constructor(private readonly service: CandidatesService) {}

  @Get()
  async findList(@Auth() user: UserEntity) {
    return await this.service.findListByCreatorId(user.id);
  }

  @Get(':id')
  async findOne(@Auth() user: UserEntity, @Param('id') id: string) {
    return await this.service.findById(id, user.id);
  }

  @Post()
  async create(@Auth() user: UserEntity, @Body() body: CreateCandidateDto) {
    return await this.service.create(body, user.id);
  }

  @Patch(':id')
  async update(
    @Auth() user: UserEntity,
    @Body() body: UpdateCandidateDto,
    @Param('id') id: string,
  ) {
    const item = await this.service.findById(id, user.id);

    if (!item) {
      throw new NotFoundException('The candidate was not found');
    }

    return await this.service.updateById(id, body, user.id);
  }

  @Delete(':id')
  async delete(@Auth() user: UserEntity, @Param('id') id: string) {
    const item = await this.service.findById(id, user.id);

    if (!item) {
      throw new NotFoundException('The candidate was not found');
    }

    return await this.service.deleteById(id, user.id);
  }
}
