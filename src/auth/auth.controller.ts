import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenDto } from './dto/access.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AccessTokenDto })
  async login(@Body() body: LoginDto) {
    return await this.service.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.service.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    const id = req.user.id;
    return { id };
  }
}
