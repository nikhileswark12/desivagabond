import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Trip } from './trip.entity';
import { TripStopActivity } from './trip-stop-activity.entity';

@Entity('trip_stops')
export class TripStop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cityName: string;

  @Column({ nullable: true })
  cityId?: string;

  @Column({ nullable: true })
  region?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ type: 'date' })
  arrivalDate: string;

  @Column({ type: 'date' })
  departureDate: string;

  @Column({ default: 0 })
  orderIndex: number;

  @OneToMany(() => TripStopActivity, (tsa) => tsa.stop, { cascade: true })
  stopActivities: TripStopActivity[];

  @ManyToOne(() => Trip, (trip) => trip.stops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column()
  tripId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
