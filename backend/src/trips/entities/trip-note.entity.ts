import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Trip } from './trip.entity';
import { TripStop } from './trip-stop.entity';

@Entity('trip_notes')
export class TripNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  stopId?: string;

  @ManyToOne(() => TripStop, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'stopId' })
  stop: TripStop;

  @Column({ nullable: true })
  stopName?: string;

  @ManyToOne(() => Trip, (trip) => trip.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column()
  tripId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
