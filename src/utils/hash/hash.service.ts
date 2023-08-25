import * as bcyrpt from 'bcrypt';

export class HashService {
  static async hash(password: string): Promise<string> {
    const salt = Number(process.env.HASH_SALT || 10);
    return await bcyrpt.hash(password, salt);
  }

  static async compare(value: string, password: string): Promise<boolean> {
    return await bcyrpt.compare(value, password);
  }
}
