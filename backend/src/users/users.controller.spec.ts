import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockUsersService = {
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      verifyEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /users/profile', () => {
    it('returns user profile object for authenticated user', async () => {
      const mockUser = { id: 'u1', email: 'test@test.com', name: 'Test' };
      usersService.findById.mockResolvedValue(mockUser as any);
      
      const req = { user: { sub: 'u1' } };
      const result = await controller.getProfile(req);
      
      expect(usersService.findById).toHaveBeenCalledWith('u1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('PUT /users/profile', () => {
    it('returns updated profile; excludes password and role from payload', async () => {
      const mockUpdated = { id: 'u1', name: 'New Name' };
      usersService.update.mockResolvedValue(mockUpdated as any);
      
      const req = { user: { sub: 'u1' } };
      const body = { name: 'New Name', password: 'hack', role: 'admin', someField: 'value' };
      
      const result = await controller.updateProfile(req, body);
      
      expect(usersService.update).toHaveBeenCalledWith('u1', { name: 'New Name', someField: 'value' });
      expect(result).toEqual(mockUpdated);
    });

    it('saves to pending_email, does not immediately update email', async () => {
      const mockUpdated = { id: 'u1', email: 'old@test.com', pending_email: 'new@test.com' };
      usersService.update.mockResolvedValue(mockUpdated as any);
      
      const req = { user: { sub: 'u1' } };
      const body = { email: 'new@test.com' };
      
      const result = await controller.updateProfile(req, body);
      
      expect(usersService.update).toHaveBeenCalledWith('u1', { email: 'new@test.com' });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('DELETE /users/account', () => {
    it('returns { message: "Account deleted" } for authenticated user', async () => {
      usersService.delete.mockResolvedValue({ message: 'Account deleted' } as any);
      
      const req = { user: { sub: 'u1' } };
      const result = await controller.deleteAccount(req);
      
      expect(usersService.delete).toHaveBeenCalledWith('u1');
      expect(result).toEqual({ message: 'Account deleted' });
    });
  });

  describe('GET /users/verify-email', () => {
    it('returns { message: "Email verified successfully", email } for valid token', async () => {
      const mockResponse = { message: 'Email verified successfully', email: 'verified@test.com' };
      usersService.verifyEmail.mockResolvedValue(mockResponse as any);
      
      const result = await controller.verifyEmail('valid-token');
      
      expect(usersService.verifyEmail).toHaveBeenCalledWith('valid-token');
      expect(result).toEqual(mockResponse);
    });

    it('throws BadRequestException for expired token', async () => {
      usersService.verifyEmail.mockRejectedValue(new BadRequestException('Token expired'));
      
      await expect(controller.verifyEmail('expired-token')).rejects.toThrow(BadRequestException);
      expect(usersService.verifyEmail).toHaveBeenCalledWith('expired-token');
    });
  });
});
