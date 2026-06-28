import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    
    if (data.email && data.email !== user.email) {
      user.pending_email = data.email;
      const rawToken = crypto.randomBytes(32).toString('hex');
      user.email_verify_token = crypto.createHash('sha256').update(rawToken).digest('hex');
      
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);
      user.email_verify_expires = expires;

      delete data.email;
      console.log(`[Stub Mailer] Verify URL: /api/users/verify-email?token=${rawToken}`);
    }

    Object.assign(user, data);
    return this.repo.save(user);
  }

  async verifyEmail(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.repo.findOne({ where: { email_verify_token: hashedToken } });
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }
    if (!user.pending_email) {
      throw new BadRequestException('No pending email to verify');
    }
    if (user.email_verify_expires && user.email_verify_expires < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }
    
    user.email = user.pending_email;
    user.pending_email = null as any;
    user.email_verify_token = null as any;
    user.email_verify_expires = null as any;
    await this.repo.save(user);
    
    return { message: 'Email verified successfully', email: user.email };
  }

  async delete(id: string) {
    await this.repo.delete(id);
    return { message: 'Account deleted' };
  }

  findAll() {
    return this.repo.find({ select: ['id', 'name', 'email', 'role', 'createdAt'] });
  }
}
