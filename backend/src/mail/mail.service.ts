import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporterPromise: Promise<nodemailer.Transporter>;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporterPromise = this.initTransporter();
  }

  private async initTransporter(): Promise<nodemailer.Transporter> {
    let host = this.configService.get<string>('MAIL_HOST');
    let port = this.configService.get<number>('MAIL_PORT');
    let user = this.configService.get<string>('MAIL_USER');
    let pass = this.configService.get<string>('MAIL_PASS');

    if (!host || !user || !pass) {
      this.logger.warn('SMTP credentials missing, generating ethereal test account...');
      const testAccount = await nodemailer.createTestAccount();
      host = testAccount.smtp.host;
      port = testAccount.smtp.port;
      user = testAccount.user;
      pass = testAccount.pass;
    }

    return nodemailer.createTransport({
      host,
      port: port || 587,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    const transporter = await this.transporterPromise;
    const info = await transporter.sendMail({
      from: '"DesiVagabond Support" <support@desivagabond.com>',
      to,
      subject: 'Reset your password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
    this.logger.log(`Password reset email sent to ${to}. URL: ${nodemailer.getTestMessageUrl(info) || 'N/A'}`);
  }

  async sendEmailVerification(to: string, verifyUrl: string): Promise<void> {
    const transporter = await this.transporterPromise;
    const info = await transporter.sendMail({
      from: '"DesiVagabond Support" <support@desivagabond.com>',
      to,
      subject: 'Verify your email address',
      html: `
        <p>Thank you for updating your profile.</p>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyUrl}">Verify Email</a>
      `,
    });
    this.logger.log(`Email verification sent to ${to}. URL: ${nodemailer.getTestMessageUrl(info) || 'N/A'}`);
  }
}
