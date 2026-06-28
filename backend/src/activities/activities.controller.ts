import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';

import { PaginationDto } from '../shared/dto/pagination.dto';

@ApiTags('Activities')
@Controller('activities')
@UseInterceptors(CacheInterceptor)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  getActivities(
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('q') q?: string,
    @Query('maxCost') maxCost?: string,
    @Query() pagination?: PaginationDto,
  ) {
    return this.activitiesService.getActivities(city, category, q, maxCost, pagination?.page, pagination?.limit);
  }

  @Get('categories')
  getCategories() {
    return [
      { id: 'adventure', label: 'Adventure', emoji: '🧗' },
      { id: 'cultural', label: 'Cultural', emoji: '🎭' },
      { id: 'sightseeing', label: 'Sightseeing', emoji: '📸' },
      { id: 'food', label: 'Food & Dining', emoji: '🍽️' },
      { id: 'leisure', label: 'Leisure', emoji: '🛥️' },
      { id: 'wellness', label: 'Wellness & Spa', emoji: '🧘' },
    ];
  }
}
