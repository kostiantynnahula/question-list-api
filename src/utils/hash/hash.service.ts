import * as bcyrpt from 'bcrypt';

export class HashService {
  private readonly salt = Number(process.env.HASH_SALT || 10);

  async hash(password: string): Promise<string> {
    return bcyrpt.hash(password, this.salt);
  }

  async compare(value: string, password: string): Promise<boolean> {
    return bcyrpt.compare(value, password);
  }
}
