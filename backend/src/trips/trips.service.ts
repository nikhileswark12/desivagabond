import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Trip } from './entities/trip.entity';
import { TripStop } from './entities/trip-stop.entity';
import { BudgetItem } from './entities/budget-item.entity';
import { PackingItem } from './entities/packing-item.entity';
import { TripNote } from './entities/trip-note.entity';
import { TripStopActivity } from './entities/trip-stop-activity.entity';
import { AuditLog } from '../admin/entities/audit-log.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private tripsRepo: Repository<Trip>,
    @InjectRepository(TripStop) private stopsRepo: Repository<TripStop>,
    @InjectRepository(BudgetItem) private budgetRepo: Repository<BudgetItem>,
    @InjectRepository(PackingItem) private packingRepo: Repository<PackingItem>,
    @InjectRepository(TripNote) private notesRepo: Repository<TripNote>,
    @InjectRepository(TripStopActivity) private stopActivitiesRepo: Repository<TripStopActivity>,
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
  ) {}

  // ── Trips ──────────────────────────────────────────────────
  async createTrip(userId: string, data: Partial<Trip>) {
    const trip = this.tripsRepo.create({ ...data, userId });
    return this.tripsRepo.save(trip);
  }

  async getTrips(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.tripsRepo.findAndCount({
      where: { userId },
      relations: ['stops'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getTrip(id: string, userId: string) {
    const trip = await this.tripsRepo.findOne({
      where: { id },
      relations: ['stops', 'stops.stopActivities', 'stops.stopActivities.activity', 'budgetItems', 'packingItems', 'notes'],
    });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.userId !== userId) throw new ForbiddenException();
    return trip;
  }

  async updateTrip(id: string, userId: string, data: Partial<Trip>) {
    const trip = await this.getTrip(id, userId);
    Object.assign(trip, data);
    return this.tripsRepo.save(trip);
  }

  async deleteTrip(id: string, userId: string) {
    const trip = await this.getTrip(id, userId);
    await this.tripsRepo.remove(trip);
    await this.auditRepo.save(this.auditRepo.create({ userId, action: 'DELETE_TRIP', entityType: 'trip', entityId: id }));
    return { message: 'Trip deleted' };
  }

  async shareTrip(id: string, userId: string, isPublic: boolean) {
    const trip = await this.getTrip(id, userId);
    trip.isPublic = isPublic;
    if (isPublic) {
      if (!trip.shareToken) {
        trip.shareToken = randomBytes(12).toString('hex');
      }
      const expiryDays = parseInt(process.env.SHARE_EXPIRY_DAYS || '30', 10);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiryDays);
      trip.shareExpiresAt = expiresAt;
    } else {
      trip.shareExpiresAt = null as any;
    }
    return this.tripsRepo.save(trip);
  }

  async getSharedTrip(token: string) {
    const trip = await this.tripsRepo.findOne({
      where: { shareToken: token, isPublic: true },
      relations: ['stops', 'budgetItems'],
    });
    if (!trip) throw new NotFoundException('Shared trip not found');
    return trip;
  }

  // ── Stops ──────────────────────────────────────────────────
  async addStop(tripId: string, userId: string, data: Partial<TripStop>) {
    await this.getTrip(tripId, userId);
    const count = await this.stopsRepo.count({ where: { tripId } });
    const stop = this.stopsRepo.create({ ...data, tripId, orderIndex: count });
    return this.stopsRepo.save(stop);
  }

  async updateStop(tripId: string, stopId: string, userId: string, data: Partial<TripStop>) {
    await this.getTrip(tripId, userId);
    const stop = await this.stopsRepo.findOne({ where: { id: stopId, tripId } });
    if (!stop) throw new NotFoundException('Stop not found');
    Object.assign(stop, data);
    return this.stopsRepo.save(stop);
  }

  async deleteStop(tripId: string, stopId: string, userId: string) {
    await this.getTrip(tripId, userId);
    await this.stopsRepo.delete({ id: stopId, tripId });
    await this.auditRepo.save(this.auditRepo.create({ userId, action: 'DELETE_STOP', entityType: 'stop', entityId: stopId }));
    return { message: 'Stop deleted' };
  }

  async reorderStops(tripId: string, userId: string, stopIds: string[]) {
    await this.getTrip(tripId, userId);
    for (let i = 0; i < stopIds.length; i++) {
      await this.stopsRepo.update({ id: stopIds[i], tripId }, { orderIndex: i });
    }
    return { message: 'Stops reordered' };
  }

  async addActivityToStop(tripId: string, stopId: string, activityId: string, userId: string) {
    await this.getTrip(tripId, userId);
    const stop = await this.stopsRepo.findOne({ where: { id: stopId, tripId } });
    if (!stop) throw new NotFoundException('Stop not found');
    
    const stopActivity = this.stopActivitiesRepo.create({ stopId, activityId });
    return this.stopActivitiesRepo.save(stopActivity);
  }

  async removeActivityFromStop(tripId: string, stopId: string, activityId: string, userId: string) {
    await this.getTrip(tripId, userId);
    await this.stopActivitiesRepo.delete({ stopId, activityId });
    return { message: 'Activity removed from stop' };
  }

  // ── Budget ─────────────────────────────────────────────────
  async getBudget(tripId: string, userId: string) {
    await this.getTrip(tripId, userId);
    return this.budgetRepo.find({ where: { tripId } });
  }

  async addBudgetItem(tripId: string, userId: string, data: Partial<BudgetItem>) {
    const trip = await this.getTrip(tripId, userId);
    if (data.stopId && !trip.stops.some(s => s.id === data.stopId)) {
      throw new ForbiddenException('Stop does not belong to this trip');
    }
    const item = this.budgetRepo.create({ ...data, tripId });
    return this.budgetRepo.save(item);
  }

  async deleteBudgetItem(tripId: string, itemId: string, userId: string) {
    await this.getTrip(tripId, userId);
    await this.budgetRepo.delete({ id: itemId, tripId });
    await this.auditRepo.save(this.auditRepo.create({ userId, action: 'DELETE_BUDGET_ITEM', entityType: 'budget_item', entityId: itemId }));
    return { message: 'Budget item deleted' };
  }

  // ── Packing ────────────────────────────────────────────────
  async getPacking(tripId: string, userId: string) {
    await this.getTrip(tripId, userId);
    return this.packingRepo.find({ where: { tripId }, order: { createdAt: 'ASC' } });
  }

  async addPackingItem(tripId: string, userId: string, data: Partial<PackingItem>) {
    await this.getTrip(tripId, userId);
    const item = this.packingRepo.create({ ...data, tripId });
    return this.packingRepo.save(item);
  }

  async updatePackingItem(tripId: string, itemId: string, userId: string, data: Partial<PackingItem>) {
    await this.getTrip(tripId, userId);
    await this.packingRepo.update({ id: itemId, tripId }, data);
    return this.packingRepo.findOne({ where: { id: itemId } });
  }

  async deletePackingItem(tripId: string, itemId: string, userId: string) {
    await this.getTrip(tripId, userId);
    await this.packingRepo.delete({ id: itemId, tripId });
    await this.auditRepo.save(this.auditRepo.create({ userId, action: 'DELETE_PACKING_ITEM', entityType: 'packing_item', entityId: itemId }));
    return { message: 'Packing item deleted' };
  }

  // ── Notes ──────────────────────────────────────────────────
  async getNotes(tripId: string, userId: string) {
    await this.getTrip(tripId, userId);
    return this.notesRepo.find({ where: { tripId }, order: { createdAt: 'DESC' } });
  }

  async addNote(tripId: string, userId: string, data: Partial<TripNote>) {
    const trip = await this.getTrip(tripId, userId);
    if (data.stopId && !trip.stops.some(s => s.id === data.stopId)) {
      throw new ForbiddenException('Stop does not belong to this trip');
    }
    const note = this.notesRepo.create({ ...data, tripId });
    return this.notesRepo.save(note);
  }

  async updateNote(tripId: string, noteId: string, userId: string, data: Partial<TripNote>) {
    const trip = await this.getTrip(tripId, userId);
    if (data.stopId && !trip.stops.some(s => s.id === data.stopId)) {
      throw new ForbiddenException('Stop does not belong to this trip');
    }
    await this.notesRepo.update({ id: noteId, tripId }, data);
    return this.notesRepo.findOne({ where: { id: noteId } });
  }

  async deleteNote(tripId: string, noteId: string, userId: string) {
    await this.getTrip(tripId, userId);
    await this.notesRepo.delete({ id: noteId, tripId });
    await this.auditRepo.save(this.auditRepo.create({ userId, action: 'DELETE_NOTE', entityType: 'note', entityId: noteId }));
    return { message: 'Note deleted' };
  }

  // ── Admin stats ────────────────────────────────────────────
  async getStats() {
    const total = await this.tripsRepo.count();
    const shared = await this.tripsRepo.count({ where: { isPublic: true } });
    const topCities = await this.stopsRepo
      .createQueryBuilder('s')
      .select('s.cityName', 'city')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.cityName')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
    return { totalTrips: total, sharedTrips: shared, topCities };
  }

  // ── Cron Jobs ──────────────────────────────────────────────
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredShares() {
    const expiredTrips = await this.tripsRepo
      .createQueryBuilder('trip')
      .where('trip.isPublic = :isPublic', { isPublic: true })
      .andWhere('trip.shareExpiresAt < :now', { now: new Date() })
      .getMany();

    for (const trip of expiredTrips) {
      trip.isPublic = false;
      trip.shareExpiresAt = null as any;
    }

    if (expiredTrips.length > 0) {
      await this.tripsRepo.save(expiredTrips);
    }
  }
}
