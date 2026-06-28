import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { TripsService } from '../trips/trips.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException } from '@nestjs/common';

describe('AdminController', () => {
  let controller: AdminController;

  const mockTripsService = {
    getStats: jest.fn(),
  };

  const mockUsersService = {
    findAll: jest.fn(),
  };

  const mockAuditRepo = {
    findAndCount: jest.fn(),
  };

  const mockCacheManager = {
    clear: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: TripsService, useValue: mockTripsService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: getRepositoryToken(AuditLog), useValue: mockAuditRepo },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /admin/stats', () => {
    it('returns stats for admin role', async () => {
      const tripStats = { totalTrips: 10, sharedTrips: 5, topCities: [] };
      const users = [{ id: '1' }, { id: '2' }];
      mockTripsService.getStats.mockResolvedValue(tripStats);
      mockUsersService.findAll.mockResolvedValue(users);

      const req = { user: { role: 'admin' } };
      const result = await controller.getStats(req);

      expect(result).toEqual({ ...tripStats, totalUsers: 2, users });
    });

    it('throws ForbiddenException for user role', async () => {
      const req = { user: { role: 'user' } };
      await expect(controller.getStats(req)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('GET /admin/audit-logs', () => {
    it('returns { data: AuditLog[], total, page, totalPages } and respects ?page and ?limit', async () => {
      const logs = [{ id: 'log1' }];
      mockAuditRepo.findAndCount.mockResolvedValue([logs, 100]);

      const req = { user: { role: 'admin' } };
      const result = await controller.getAuditLogs(req, 2, 10);

      expect(mockAuditRepo.findAndCount).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        skip: 10,
        take: 10,
      });
      expect(result).toEqual({ data: logs, total: 100, page: 2, totalPages: 10 });
    });
  });

  describe('POST /admin/cache/clear', () => {
    it("returns { message: 'Cache cleared successfully' } for admin role", async () => {
      const req = { user: { role: 'admin' } };
      const result = await controller.clearCache(req);

      expect(mockCacheManager.clear).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Cache cleared successfully' });
    });
  });
});
