import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
  getTestMessageUrl: jest.fn(),
}));

describe('MailService', () => {
  let service: MailService;
  let mockTransporter: any;

  beforeEach(async () => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
    };
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const env: Record<string, any> = {
                MAIL_HOST: 'smtp.example.com',
                MAIL_PORT: 587,
                MAIL_USER: 'test@example.com',
                MAIL_PASS: 'password',
              };
              return env[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendPasswordReset', () => {
    it('calls transporter.sendMail with correct to, subject containing Reset, and html containing the reset url', async () => {
      await service.sendPasswordReset('user@test.com', 'http://reset-link');

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user@test.com',
          subject: expect.stringContaining('Reset'),
          html: expect.stringContaining('http://reset-link'),
        }),
      );
    });

    it('resolves without throwing when transporter.sendMail succeeds', async () => {
      await expect(service.sendPasswordReset('user@test.com', 'http://reset-link')).resolves.not.toThrow();
    });

    it('throws and propagates error when transporter.sendMail rejects', async () => {
      const error = new Error('SMTP Error');
      mockTransporter.sendMail.mockRejectedValue(error);

      await expect(service.sendPasswordReset('user@test.com', 'http://reset-link')).rejects.toThrow(error);
    });
  });

  describe('sendEmailVerification', () => {
    it('calls transporter.sendMail with correct to, subject containing Verify, and html containing the verify url', async () => {
      await service.sendEmailVerification('user@test.com', 'http://verify-link');

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user@test.com',
          subject: expect.stringContaining('Verify'),
          html: expect.stringContaining('http://verify-link'),
        }),
      );
    });

    it('resolves without throwing when transporter.sendMail succeeds', async () => {
      await expect(service.sendEmailVerification('user@test.com', 'http://verify-link')).resolves.not.toThrow();
    });

    it('throws and propagates error when transporter.sendMail rejects', async () => {
      const error = new Error('SMTP Error');
      mockTransporter.sendMail.mockRejectedValue(error);

      await expect(service.sendEmailVerification('user@test.com', 'http://verify-link')).rejects.toThrow(error);
    });
  });
});
