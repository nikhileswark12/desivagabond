import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Trip } from './trip.entity';
import { TripStop } from './trip-stop.entity';

@Entity('budget_items')
export class BudgetItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string; // transport | stay | activities | meals | other

  @Column()
  label: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  stopId?: string;

  @ManyToOne(() => TripStop, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'stopId' })
  stop: TripStop;

  @ManyToOne(() => Trip, (trip) => trip.budgetItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column()
  tripId: string;

  @CreateDateColumn()
  createdAt: Date;
}
