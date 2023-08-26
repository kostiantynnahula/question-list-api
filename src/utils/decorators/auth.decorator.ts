import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Omit<UserEntity, 'password'> => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
