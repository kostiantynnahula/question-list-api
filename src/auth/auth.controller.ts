import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenDto } from './dto/access.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create.dto';

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
  async register(@Body() body: CreateUserDto) {
    return await this.service.register(body);
  }
}
