import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { TripStop } from './entities/trip-stop.entity';
import { BudgetItem } from './entities/budget-item.entity';
import { PackingItem } from './entities/packing-item.entity';
import { TripNote } from './entities/trip-note.entity';
import { TripStopActivity } from './entities/trip-stop-activity.entity';
import { AuditLog } from '../admin/entities/audit-log.entity';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripStop, BudgetItem, PackingItem, TripNote, TripStopActivity, AuditLog])],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
