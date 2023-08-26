import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EmailValidator } from './validator/email.validator';
import { JwtStrategy } from './jwt.strategy';
import { ResetPasswordModule } from 'src/reset-password/reset-password.module';

export const jwtSecret = process.env.JWT_SECRET || 'secret';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ResetPasswordModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, EmailValidator, JwtStrategy],
})
export class AuthModule {}
