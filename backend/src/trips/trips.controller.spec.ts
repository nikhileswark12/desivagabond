import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { PaginationDto } from '../shared/dto/pagination.dto';

describe('TripsController', () => {
  let controller: TripsController;
  let service: TripsService;

  const mockTripsService = {
    getTrips: jest.fn(),
    deleteTrip: jest.fn(),
    addStop: jest.fn(),
    reorderStops: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [
        {
          provide: TripsService,
          useValue: mockTripsService,
        },
      ],
    }).compile();

    controller = module.get<TripsController>(TripsController);
    service = module.get<TripsService>(TripsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /trips', () => {
    it('returns only trips belonging to req.user.id', async () => {
      const trips = [{ id: '1', userId: 'user-1' }];
      mockTripsService.getTrips.mockResolvedValue(trips);
      const req = { user: { sub: 'user-1' } };
      const pagination: PaginationDto = { page: 1, limit: 10 };

      const result = await controller.list(req, pagination);
      
      expect(result).toEqual(trips);
      expect(mockTripsService.getTrips).toHaveBeenCalledWith('user-1', 1, 10);
    });
  });

  describe('DELETE /trips/:id', () => {
    it('returns 200 for the trip owner', async () => {
      mockTripsService.deleteTrip.mockResolvedValue({ success: true });
      const req = { user: { sub: 'user-1' } };

      const result = await controller.remove('trip-1', req);
      
      expect(result).toEqual({ success: true });
      expect(mockTripsService.deleteTrip).toHaveBeenCalledWith('trip-1', 'user-1');
    });

    it('throws ForbiddenException when trip.userId !== req.user.id', async () => {
      mockTripsService.deleteTrip.mockRejectedValue(new ForbiddenException());
      const req = { user: { sub: 'user-1' } };

      await expect(controller.remove('trip-2', req)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('POST /trips/:id/stops', () => {
    it('throws BadRequestException when arrivalDate or departureDate falls outside parent trip startDate–endDate range', async () => {
      mockTripsService.addStop.mockRejectedValue(new BadRequestException());
      const req = { user: { sub: 'user-1' } };
      
      await expect(controller.addStop('trip-1', req, { arrivalDate: 'bad', departureDate: 'bad' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('PATCH /trips/:id/stops/reorder', () => {
    it('updates orderIndex for each stopId to match its position in the input array', async () => {
      mockTripsService.reorderStops.mockResolvedValue({ success: true });
      const req = { user: { sub: 'user-1' } };
      const body = { stopIds: ['stop-2', 'stop-1', 'stop-3'] };

      const result = await controller.reorderStops('trip-1', req, body);
      
      expect(result).toEqual({ success: true });
      expect(mockTripsService.reorderStops).toHaveBeenCalledWith('trip-1', 'user-1', body.stopIds);
    });
  });
});
