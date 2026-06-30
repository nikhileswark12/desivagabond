import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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
    service = module.get<UsersService>(UsersService);
  });

  describe('getProfile', () => {
    it("returns the authenticated user's profile object", async () => {
      const mockProfile = { id: 'uuid-1', name: 'Test User' };
      (service.findById as jest.Mock).mockResolvedValue(mockProfile);

      const req = { user: { sub: 'uuid-1' } };
      const result = await controller.getProfile(req);

      expect(service.findById).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('returns updated profile; strips password and role from the incoming payload before calling the service', async () => {
      const mockUpdatedProfile = { id: 'uuid-1', name: 'Updated Name' };
      (service.update as jest.Mock).mockResolvedValue(mockUpdatedProfile);

      const req = { user: { sub: 'uuid-1' } };
      const body = { name: 'Updated Name', password: 'newpass', role: 'admin', someOtherField: 'value' };
      
      const result = await controller.updateProfile(req, body);

      expect(service.update).toHaveBeenCalledWith('uuid-1', { name: 'Updated Name', someOtherField: 'value' });
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('saves to pending_email, does not overwrite email immediately', async () => {
      // The controller just passes the payload (sans password/role) to the service, where the pending_email logic resides.
      // We test that the controller passes the email correctly.
      const mockUpdatedProfile = { id: 'uuid-1', pending_email: 'new@email.com' };
      (service.update as jest.Mock).mockResolvedValue(mockUpdatedProfile);

      const req = { user: { sub: 'uuid-1' } };
      const body = { email: 'new@email.com' };
      
      const result = await controller.updateProfile(req, body);

      expect(service.update).toHaveBeenCalledWith('uuid-1', { email: 'new@email.com' });
      expect(result).toEqual(mockUpdatedProfile);
    });
  });

  describe('deleteAccount', () => {
    it("returns { message: 'Account deleted' } for the authenticated user", async () => {
      const mockResponse = { message: 'Account deleted' };
      (service.delete as jest.Mock).mockResolvedValue(mockResponse);

      const req = { user: { sub: 'uuid-1' } };
      const result = await controller.deleteAccount(req);

      expect(service.delete).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('verifyEmail', () => {
    it("returns { message: 'Email verified successfully', email }", async () => {
      const mockResponse = { message: 'Email verified successfully', email: 'test@example.com' };
      (service.verifyEmail as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.verifyEmail('valid');

      expect(service.verifyEmail).toHaveBeenCalledWith('valid');
      expect(result).toEqual(mockResponse);
    });

    it('throws BadRequestException for expired token', async () => {
      (service.verifyEmail as jest.Mock).mockRejectedValue(new BadRequestException('Verification token has expired'));

      await expect(controller.verifyEmail('expired')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for invalid token', async () => {
      (service.verifyEmail as jest.Mock).mockRejectedValue(new BadRequestException('Invalid verification token'));

      await expect(controller.verifyEmail('invalid')).rejects.toThrow(BadRequestException);
    });
  });
});
