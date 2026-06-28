import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Trip } from '../trips/entities/trip.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  language?: string;

  @Column({ nullable: true })
  pending_email?: string;

  @Column({ nullable: true })
  email_verify_token?: string;

  @Column({ nullable: true })
  email_verify_expires?: Date;

  @Column(
    process.env.DB_TYPE === 'postgres' ? 'text' : 'simple-array',
    { nullable: true, array: process.env.DB_TYPE === 'postgres' ? true : undefined }
  )
  savedDestinations?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];
}
