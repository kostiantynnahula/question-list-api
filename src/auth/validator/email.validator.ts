import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class EmailValidator implements ValidatorConstraintInterface {
  public message = 'email already taken';

  constructor(private readonly service: UsersService) {}

  async validate(email: string): Promise<boolean> {
    return !(await this.service.findByEmail(email));
  }

  defaultMessage(): string {
    return this.message;
  }
}
