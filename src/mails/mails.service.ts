import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendResetLink(email: string, token: string) {
    const url = `${process.env.APP_UI_URL}/reset?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password',
      template: './reset',
      context: { url },
    });
  }
}
