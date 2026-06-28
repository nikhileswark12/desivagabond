import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    getProfile: jest.fn(),
  };

  const mockResponse = () => {
    const res: any = {};
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('returns 201 with user object on valid input', async () => {
      const user = { id: 1, email: 'test@test.com' };
      mockAuthService.register.mockResolvedValue({ user, token: 'fake-jwt' });
      const res = mockResponse();
      
      const result = await controller.register({ name: 'Test', email: 'test@test.com', password: 'password123' }, res);
      
      expect(result).toEqual({ user });
      expect(res.cookie).toHaveBeenCalledWith('jwt', 'fake-jwt', expect.any(Object));
    });

    it('throws ConflictException on duplicate email', async () => {
      mockAuthService.register.mockRejectedValue(new ConflictException('Email exists'));
      const res = mockResponse();
      
      await expect(
        controller.register({ name: 'Test', email: 'test@test.com', password: 'password123' }, res)
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('returns user object on valid credentials', async () => {
      const user = { id: 1, email: 'test@test.com' };
      mockAuthService.login.mockResolvedValue({ user, token: 'fake-jwt' });
      const res = mockResponse();
      
      const result = await controller.login({ email: 'test@test.com', password: 'password123' }, res);
      
      expect(result).toEqual({ user });
      expect(res.cookie).toHaveBeenCalledWith('jwt', 'fake-jwt', expect.any(Object));
    });

    it('throws UnauthorizedException on wrong password', async () => {
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));
      const res = mockResponse();
      
      await expect(
        controller.login({ email: 'test@test.com', password: 'wrong' }, res)
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgot-password', () => {
    it("always returns { message: 'If an account exists, a reset link was sent' } regardless of whether email is registered", async () => {
      mockAuthService.forgotPassword.mockResolvedValue({ message: 'If an account exists, a reset link was sent' });
      const result = await controller.forgotPassword({ email: 'unknown@test.com' });
      expect(result).toEqual({ message: 'If an account exists, a reset link was sent' });
    });
  });
});
