import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';

import { PaginationDto } from '../shared/dto/pagination.dto';

@ApiTags('Cities')
@Controller('cities')
@UseInterceptors(CacheInterceptor)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  getCities(
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('region') region?: string,
    @Query('state') state?: string,
    @Query() pagination?: PaginationDto,
  ) {
    return this.citiesService.getCities(q, type, region, state, pagination?.page, pagination?.limit);
  }

  @Get('types')
  getTypes() {
    return [
      { id: 'hill-station', label: 'Hill Stations', emoji: '⛰️' },
      { id: 'beach', label: 'Beaches', emoji: '🏖️' },
      { id: 'heritage', label: 'Heritage & Culture', emoji: '🏛️' },
      { id: 'tropical', label: 'Tropical & Backwaters', emoji: '🌴' },
      { id: 'desert', label: 'Desert', emoji: '🏜️' },
      { id: 'wildlife', label: 'Wildlife', emoji: '🐯' },
      { id: 'metro', label: 'Metro Cities', emoji: '🏙️' },
    ];
  }

  @Get('regions')
  getRegions() {
    return ['North India', 'South India', 'East India', 'West India', 'Central India', 'Northeast India', 'Islands'];
  }
}
