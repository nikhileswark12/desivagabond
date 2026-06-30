import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../users/user.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(PasswordResetToken) private resetTokenRepo: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');
    
    const hashed = await bcrypt.hash(password, 12);
    
    const rawToken = crypto.randomBytes(32).toString('hex');
    const emailVerifyToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    const user = this.usersRepo.create({ 
      name, 
      email, 
      password: hashed,
      email_verify_token: emailVerifyToken,
      email_verify_expires: expires
    });
    await this.usersRepo.save(user);

    const verifyUrl = `http://localhost:3000/api/users/verify-email?token=${rawToken}`;
    await this.mailService.sendEmailVerification(user.email, verifyUrl);

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    
    if (!user.emailVerified) {
      throw new ForbiddenException('Please verify your email to log in');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async getProfile(userId: string) {
    return this.usersRepo.findOne({ where: { id: userId }, select: ['id', 'name', 'email', 'avatar', 'role', 'language', 'savedDestinations', 'createdAt'] });
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return { message: 'If an account exists, a reset link was sent' };

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const resetToken = this.resetTokenRepo.create({
      userId: user.id,
      tokenHash,
      expiresAt,
    });
    await this.resetTokenRepo.save(resetToken);

    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    await this.mailService.sendPasswordReset(user.email, resetUrl);
    return { message: 'If an account exists, a reset link was sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const resetToken = await this.resetTokenRepo.findOne({
      where: { tokenHash, usedAt: IsNull(), expiresAt: MoreThan(new Date()) },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = await this.usersRepo.findOne({ where: { id: resetToken.userId } });
    if (!user) throw new NotFoundException('User not found');

    user.password = await bcrypt.hash(newPassword, 12);
    await this.usersRepo.save(user);

    resetToken.usedAt = new Date();
    await this.resetTokenRepo.save(resetToken);

    return { message: 'Password reset successfully' };
  }
}
