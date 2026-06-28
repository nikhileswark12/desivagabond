import { Controller, Get, Post, UseGuards, Request, ForbiddenException, Inject, Query } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TripsService } from '../trips/trips.service';
import { UsersService } from '../users/users.service';
import { AuditLog } from './entities/audit-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private tripsService: TripsService,
    private usersService: UsersService,
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Get('stats')
  async getStats(@Request() req: any) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Admins only');
    const [tripStats, users] = await Promise.all([
      this.tripsService.getStats(),
      this.usersService.findAll(),
    ]);
    return { ...tripStats, totalUsers: users.length, users };
  }

  @Post('cache/clear')
  async clearCache(@Request() req: any) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Admins only');
    await this.cacheManager.clear();
    return { message: 'Cache cleared successfully' };
  }

  @Get('audit-logs')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAuditLogs(@Request() req: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Admins only');
    
    const skip = (page - 1) * limit;
    const [data, total] = await this.auditRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    
    return { data, total, page: Number(page), totalPages: Math.ceil(total / limit) };
  }
}
