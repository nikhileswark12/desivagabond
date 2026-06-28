import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { TripStop } from './trip-stop.entity';
import { Activity } from '../../activities/activity.entity';

@Entity('trip_stop_activities')
export class TripStopActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TripStop, (stop) => stop.stopActivities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stopId' })
  stop: TripStop;

  @Column()
  stopId: string;

  @ManyToOne(() => Activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  activity: Activity;

  @Column()
  activityId: string;

  @CreateDateColumn()
  addedAt: Date;
}
