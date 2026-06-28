import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  category: string;

  @Column('int')
  cost: number;

  @Column('int')
  duration: number;

  @Column()
  description: string;
}
