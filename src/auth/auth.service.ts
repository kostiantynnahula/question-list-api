import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/utils/hash/hash.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { CreateUserDto } from 'src/users/dto/create.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { jwtSecret } from './auth.module';
import { ResetDto } from './dto/reset.dto';
import { ResetPasswordService } from 'src/reset-password/reset-password.service';
import { ForgotDto } from './dto/forgot.dto';
import * as randomstring from 'randomstring';
import { MailsService } from 'src/mails/mails.service';
import { UpdateUserDto } from 'src/users/dto/update.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly resetService: ResetPasswordService,
    private readonly mailsService: MailsService,
  ) {}

  async login(data: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const matchPassword = await HashService.compare(
      data.password,
      user.password,
    );

    if (!matchPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign(
      { id: user.id },
      { secret: jwtSecret },
    );

    const { id, username, email } = user;

    return { id, username, email, accessToken };
  }

  async register(
    data: CreateUserDto,
  ): Promise<Pick<UserEntity, 'id' | 'email' | 'username'>> {
    const hashedPassword = await HashService.hash(data.password);

    const { id, username, email } = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });

    return {
      id,
      username,
      email,
    };
  }

  async forgor(data: ForgotDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new NotFoundException('User is not exist');
    }

    const item = await this.resetService.findByEmail(user.email);

    if (item) {
      return {
        message:
          'We have already sent you a link to reset you password, please check you mailbox',
      };
    }

    const token = randomstring.generate({
      length: 12,
      charset: 'alphabetic',
    });

    await this.mailsService.sendResetLink(user.email, token);

    const resetPassPayload = {
      userId: user.id,
      email: user.email,
      token,
    };

    await this.resetService.create(resetPassPayload);
  }

  async reset(data: ResetDto): Promise<void> {
    const item = await this.resetService.findByToken(data.token);

    if (!item) {
      throw new BadRequestException('Reset token is incorrect');
    }

    const password = await HashService.hash(data.password);

    await this.usersService.updateById(item.userId, { password });

    await this.resetService.deleteById(item.id);
  }

  async updateProfile(id: string, data: UpdateUserDto) {
    if (data.password) {
      data.password = await HashService.hash(data.password);
    }

    return await this.usersService.updateById(id, data);
  }
}
