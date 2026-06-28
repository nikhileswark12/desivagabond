import { Controller, Get, Param, GoneException } from '@nestjs/common';
import { TripsService } from '../trips/trips.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Shared')
@Controller('shared')
export class SharedController {
  constructor(private tripsService: TripsService) {}

  @Get(':token')
  async getSharedTrip(@Param('token') token: string) {
    const trip = await this.tripsService.getSharedTrip(token);
    if (trip.shareExpiresAt && trip.shareExpiresAt < new Date()) {
      throw new GoneException('This shared trip link has expired');
    }
    return trip;
  }
}
