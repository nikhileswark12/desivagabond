import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
  ) {}

  async getCities(q?: string, type?: string, region?: string, state?: string, page = 1, limit = 10) {
    const query = this.cityRepo.createQueryBuilder('city');

    if (q) {
      const qLower = q.toLowerCase();
      query.andWhere(
        '(LOWER(city.name) LIKE :q OR LOWER(city.state) LIKE :q OR LOWER(city.region) LIKE :q)',
        { q: `%${qLower}%` },
      );
    }
    if (type) {
      query.andWhere('city.type = :type', { type });
    }
    if (region) {
      query.andWhere('city.region = :region', { region });
    }
    if (state) {
      query.andWhere('LOWER(city.state) LIKE LOWER(:state)', { state: `%${state}%` });
    }

    query.orderBy('city.popularity', 'DESC');
    
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);
    
    const [data, total] = await query.getManyAndCount();
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }
}
