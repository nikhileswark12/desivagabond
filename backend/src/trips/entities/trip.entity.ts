import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { TripStop } from './trip-stop.entity';
import { BudgetItem } from './budget-item.entity';
import { PackingItem } from './packing-item.entity';
import { TripNote } from './trip-note.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ nullable: true })
  coverPhoto?: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true, unique: true })
  shareToken?: string;

  @Column({ type: 'datetime', nullable: true })
  shareExpiresAt?: Date;

  @Column({ default: 'draft' })
  status: string;

  @ManyToOne(() => User, (user) => user.trips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => TripStop, (stop) => stop.trip, { cascade: true })
  stops: TripStop[];

  @OneToMany(() => BudgetItem, (b) => b.trip, { cascade: true })
  budgetItems: BudgetItem[];

  @OneToMany(() => PackingItem, (p) => p.trip, { cascade: true })
  packingItems: PackingItem[];

  @OneToMany(() => TripNote, (n) => n.trip, { cascade: true })
  notes: TripNote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
