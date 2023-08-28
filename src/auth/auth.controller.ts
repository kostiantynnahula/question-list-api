import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';
import { UpdateUserDto } from 'src/users/dto/update.dto';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    return await this.service.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.service.register(body);
  }

  @Post('forgot')
  async forgot(@Body() body: ForgotDto) {
    await this.service.forgor(body);

    return {
      message:
        'We have sent you a link to reset you password, please check you mailbox',
    };
  }

  @Post('reset')
  async reset(@Body() body: ResetDto) {
    await this.service.reset(body);
    return {
      message: 'Password successfully changed',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Auth() user: UserEntity) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Auth() user: UserEntity, @Body() body: UpdateUserDto) {
    return await this.service.updateProfile(user.id, body);
  }
}
