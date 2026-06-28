import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
  ) {}

  async getActivities(city?: string, category?: string, q?: string, maxCost?: string, page = 1, limit = 10) {
    const query = this.activityRepo.createQueryBuilder('activity');

    if (city) {
      query.andWhere('LOWER(activity.city) LIKE LOWER(:city)', { city: `%${city}%` });
    }
    if (category) {
      query.andWhere('activity.category = :category', { category });
    }
    if (q) {
      query.andWhere('LOWER(activity.name) LIKE LOWER(:q)', { q: `%${q}%` });
    }
    if (maxCost) {
      query.andWhere('activity.cost <= :maxCost', { maxCost: Number(maxCost) });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }
}
