import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/utils/hash/hash.service';
import { LoginDto } from './dto/login.dto';
import { AccessTokenDto } from './dto/access.dto';
import { CreateUserDto } from 'src/users/dto/create.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { jwtSecret } from './auth.module';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto): Promise<AccessTokenDto> {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const matchPassword = await HashService.compare(
      user.password,
      data.password,
    );

    if (matchPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign(
      { id: user.id },
      { secret: jwtSecret },
    );

    return { accessToken };
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
}
